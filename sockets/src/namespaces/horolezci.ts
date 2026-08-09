import { Server, Socket } from "socket.io";
import {
  GameData, HorolezciGameState, HorolezciPlayer,
} from "../types/game";
import { GameRoomsMap } from "../socket";
import {generatePyramid} from "../utils/horolezciLetterPyramid";
import { SECRETS } from "../utils/horolezci/secrets";
import {checkForGameover, evaluateGuesses} from "../utils/horolezci/evaluateGuesses";
import {calculateAndUpdateMMR} from "../utils/calculateAndUpdateMMR";

const ROUND_DURATION = 20 * 1000; // 20s
const NAMESPACE = "/horolezci";
const horolezciGameData = new Map<string, HorolezciGameState>();
const roundEndTimer = new Map<string, NodeJS.Timeout>();
const newRoundTimer = new Map<string, NodeJS.Timeout>();
const usedSecrets = new Map<string, Set<{type: string, secret: string}>>();
const activeSockets = new Map<string, string>();

function pickRandomSecret(gameId: string): {type: string, secret: string} {
    const usedSecretsForGame = usedSecrets.get(gameId) || new Set();
    const availableSecrets = SECRETS.filter(secret => !usedSecretsForGame.has(secret));
    if (availableSecrets.length === 0) {
        throw new Error("No more secrets available for this game.");
    }
    const randomSecret = availableSecrets[Math.floor(Math.random() * availableSecrets.length)];
    usedSecretsForGame.add(randomSecret);
    usedSecrets.set(gameId, usedSecretsForGame);
    return randomSecret;
}

function startNextRound(gameState: HorolezciGameState, player: HorolezciPlayer, enemy: HorolezciPlayer, horolezciNamespace: any, gameId: string) {
  // Set the new round end time
  gameState.roundEndTime = Date.now() + ROUND_DURATION;
  const timer = setTimeout(() => {
    evaluateAndStartNewRound(gameState, player!, enemy!, horolezciNamespace, gameId);
    // Reset ready status for both players
    player!.readyForNextRound = false;
    enemy!.readyForNextRound = false;
  }, ROUND_DURATION);
  roundEndTimer.set(gameId, timer);
  gameState.pyramid = generatePyramid(gameState.correctLetters, new Set(gameState.guessedLetters));

  // Detect if the whole secret has been guessed
    const allLettersGuessed = gameState.correctLetters.every(letter => gameState.guessedLetters.includes(letter.toLowerCase()));
    if (allLettersGuessed) {
        // If all letters have been guessed, pick a new secret
        const newSecret = pickRandomSecret(gameId);
        gameState.secret = newSecret;
        gameState.correctLetters = Array.from(newSecret.secret.toLowerCase().replace(/[^a-záčďéěíňóřšťúůýž]/g, ""));
        gameState.guessedLetters = [];
        gameState.pyramid = generatePyramid(gameState.correctLetters, new Set());
    }

  // Broadcast updated game state to both players
  horolezciNamespace.to(gameId).emit("newRound", {data: gameState, newSecret: allLettersGuessed, msRemaining: gameState.roundEndTime! - Date.now()});
}
function evaluateAndStartNewRound(gameState: HorolezciGameState, player: HorolezciPlayer, enemy: HorolezciPlayer, horolezciNamespace: any, gameId: string) {
  evaluateGuesses(gameState, player!, enemy!, horolezciNamespace, gameId);

  const sentenceGuessed = gameState.correctLetters.every((letter) => gameState.guessedLetters.includes(letter));
  if (!checkForGameover(gameState, player!, enemy!, horolezciNamespace, gameId)) {
    const timer = setTimeout(() => {
      startNextRound(gameState, player!, enemy!, horolezciNamespace, gameId);
    }, sentenceGuessed ? 8000 : 6000)
    newRoundTimer.set(gameId, timer);
  }
  else {
    clearTimeout(roundEndTimer.get(gameId));
    clearTimeout(newRoundTimer.get(gameId));
    roundEndTimer.delete(gameId);
    newRoundTimer.delete(gameId);
    usedSecrets.delete(gameId);
    horolezciGameData.delete(gameId);
  }
}

export function setupHorolezciNamespace(io: Server) {
  const horolezciNamespace = io.of(NAMESPACE);

  horolezciNamespace.on("connection", (socket: Socket) => {
    const gameId = socket.handshake.auth?.gameId;
    const token = socket.handshake.auth?.token;

    if (!gameId || !token) {
      console.log("Missing userId or gameId, disconnecting...");
      socket.disconnect();
      return;
    }

    socket.join(gameId);

    const generalGameData = GameRoomsMap.get(gameId) as GameData;
    const id = generalGameData?.players.find(
      (player) => player.token === token,
    )!.id;

    socket.data.userId = id;
    activeSockets.set(`${gameId}:${id}`, socket.id);

    if (
      !horolezciGameData.has(gameId) ||
      !horolezciGameData.get(gameId)?.players
    ) {
      console.log(`Initializing game state for gameId: ${gameId}`);
      const players = generalGameData?.players.map((player) => {
        const p: HorolezciPlayer = {
          id: player.id,
          name: player.name,
          token: player.token,
          distanceTraveled: 0,
          lockedInGuess: {letter: "", scoreMultiplier: 1},
          readyForNextRound: false,
          isConnected: true, // Mark the player as connected
          safetyPins: 2,
          lastSafetyPin: 0,
        };
        return p;
      });

      const secret = pickRandomSecret(gameId);
      const veta = secret.secret;
      horolezciGameData.set(gameId, {
        players,
        guessedLetters: [],
        correctLetters: Array.from(veta.toLowerCase().replace(/[^a-záčďéěíňóřšťúůýž]/g, "")),
        secret: secret,
        pyramid: generatePyramid(Array.from(new Set(veta.toLowerCase().replace(/[^a-záčďéěíňóřšťúůýž]/g, ""))), new Set()),
        roundEndTime: null, // null = round not started yet
      });
    }

    const gameState = horolezciGameData.get(gameId)!;
    if (!gameState.players) {
      socket.emit("end");
      console.log(`No players found in game ${gameId}. Disconnecting...`);
      socket.disconnect();
      return;
    }

    const player = gameState.players?.find((player) => player.id === id);
    const enemy = gameState.players?.find((player) => player.id !== id);
    if (gameState.players) {
      const wasDisconnected = player?.isConnected === false;
      player!.isConnected = true;

      if (wasDisconnected) {
        console.log(`Player ${id} reconnected to game ${gameId}.`);
        socket.to(gameId).emit("playerReconnected");
      }
    }

    const payload = {
      ...gameState,
      msRemaining: gameState.roundEndTime ? gameState.roundEndTime - Date.now() : null
    };
    horolezciNamespace.to(socket.id).emit("gameState", payload);
    socket.on("getGameState", () => {
      const payload = {
        ...gameState,
        msRemaining: gameState.roundEndTime ? gameState.roundEndTime - Date.now() : null
      };
      horolezciNamespace.to(socket.id).emit("gameState", payload);
    });

    socket.on("lockInGuess", (data: {letter: string, scoreMultiplier: number}) => {
        player!.lockedInGuess = data;
    })
    socket.on("setReadyForNextRound", () => {
      player!.readyForNextRound = true;
    })

    socket.on("placeSafety", () => {
        if (player!.safetyPins > 0) {
            player!.lockedInGuess = null;
        }
    })

    socket.on("startNextRound", () => {
      if (!player!.readyForNextRound || !enemy!.readyForNextRound) {
        return;
      }

      player!.readyForNextRound = false;
      enemy!.readyForNextRound = false;
      startNextRound(gameState, player!, enemy!, horolezciNamespace, gameId);
    })

    socket.on("disconnect", () => {
      const socketKey = `${gameId}:${id}`;
      if (activeSockets.get(socketKey) !== socket.id) {
        // A newer connection (e.g. from a page refresh) has already replaced
        // this socket. This is the old, stale connection finally timing out —
        // ignore it, the player is actually still connected.
        return;
      }
      activeSockets.delete(socketKey);

      const gameData = horolezciGameData.get(gameId);
      if (gameData) {
        if (player) {
          player.isConnected = false; // Mark the player as disconnected
        }
        horolezciNamespace.to(gameId).emit("playerDisconnected", { id });

        if (
          gameData.players?.filter((player) => player.isConnected).length === 0
        ) {
          // If all players are disconnected, remove the game data
          // Remove all timeouts
          clearTimeout(roundEndTimer.get(gameId));
          clearTimeout(newRoundTimer.get(gameId));
          roundEndTimer.delete(gameId);
          newRoundTimer.delete(gameId);
          usedSecrets.delete(gameId);
          for (const p of gameData.players ?? []) {
            activeSockets.delete(`${gameId}:${p.id}`);
          }
          horolezciGameData.delete(gameId);
          GameRoomsMap.delete(gameId);
        }
      }
    });
  });

  console.log("Horolezci namespace initialized.");
}
