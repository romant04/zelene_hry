import { Server, Socket } from "socket.io";
import {
  GameData, HorolezciGameState, HorolezciPlayer,
} from "../types/game";
import { GameRoomsMap } from "../socket";
import {generatePyramid} from "../utils/horolezciLetterPyramid";

const veta = "Kdo jinému jámu kopá, sám do ní padá"; // TODO: Replace this with a random pick from a list of sentences

const ROUND_DURATION = 30 * 1000; // 30s in milliseconds
const NAMESPACE = "/horolezci";
const horolezciGameData = new Map<string, HorolezciGameState>();

function evaluateGuesses(gameState: HorolezciGameState, player: HorolezciPlayer, enemy: HorolezciPlayer, horolezciNamespace: any, gameId: string) {
  const distanceMultiplier = 50; // We do * 50 because the height is roughly 1500, and we want to make sure the player can reach the top of the pyramid in a reasonable number of rounds
  // Evaluate the guesses of both players
  const playerGuess = player!.lockedInGuess?.letter?.toLowerCase();
  const enemyGuess = enemy!.lockedInGuess?.letter?.toLowerCase();

  const numberOfPlayerGuessOccurrences = playerGuess ? gameState.correctLetters.filter(x => x.toLowerCase() === playerGuess.toLowerCase()).length : 0;
  if (numberOfPlayerGuessOccurrences > 0) {
    const distance = numberOfPlayerGuessOccurrences * player!.lockedInGuess.scoreMultiplier;
    player!.distanceTraveled += distance * distanceMultiplier;
    gameState.guessedLetters.push(playerGuess); // Add the guessed letter to the guessedLetters array
  }
  else {
    player!.distanceTraveled -= 8 * distanceMultiplier; // Penalize the player for an incorrect guess
    if (player!.distanceTraveled < player.lastSafetyPin) {
      player!.distanceTraveled = player.lastSafetyPin; // Ensure the distance doesn't go below 0
    }
  }

  const numberOfEnemyGuessOccurrences = enemyGuess ? gameState.correctLetters.filter(x => x.toLowerCase() === enemyGuess.toLowerCase()).length : 0;
  if (numberOfEnemyGuessOccurrences > 0) {
    const distance = numberOfEnemyGuessOccurrences * enemy!.lockedInGuess.scoreMultiplier;
    enemy!.distanceTraveled += distance * distanceMultiplier;
    gameState.guessedLetters.push(enemyGuess); // Add the guessed letter to the guessedLetters array
  }
  else {
    enemy!.distanceTraveled -= 8 * distanceMultiplier; // Penalize the enemy for an incorrect guess
    if (enemy!.distanceTraveled < enemy.lastSafetyPin) {
      enemy!.distanceTraveled = enemy.lastSafetyPin; // Ensure the distance doesn't go below 0
    }
  }

  // Reset locked in guesses for the next round
  player!.lockedInGuess = {letter: "", scoreMultiplier: 1};
  enemy!.lockedInGuess = {letter: "", scoreMultiplier: 1};

  // Broadcast updated game state to both players
  horolezciNamespace.to(gameId).emit("roundEnded", {data: gameState, playerGuess, enemyGuess});
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
          safetyPins: 3,
          lastSafetyPin: 0,
        };
        return p;
      });

      horolezciGameData.set(gameId, {
        players,
        guessedLetters: [],
        correctLetters: Array.from(veta.toLowerCase().replace(/[^a-záčďéěíňóřšťúůýž]/g, "")),
        secret: veta,
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

    horolezciNamespace.to(socket.id).emit("gameState", gameState);
    socket.on("getGameState", () => {
      horolezciNamespace.to(socket.id).emit("gameState", gameState);
    });

    socket.on("lockInGuess", (data: {letter: string, scoreMultiplier: number}) => {
        player!.lockedInGuess = data;
    })
    socket.on("setReadyForNextRound", () => {
      player!.readyForNextRound = true;
    })

    socket.on("startNextRound", () => {
      if (!player!.readyForNextRound || !enemy!.readyForNextRound) {
        console.log(`Both players are not ready for the next round in game ${gameId}.`);
        return;
      }

      // Reset ready status for both players
      player!.readyForNextRound = false;
      enemy!.readyForNextRound = false;

      // Set the new round end time
      gameState.roundEndTime = Date.now() + ROUND_DURATION;
      setTimeout(() => {
        evaluateGuesses(gameState, player!, enemy!, horolezciNamespace, gameId);
      }, ROUND_DURATION);
      gameState.pyramid = generatePyramid(gameState.correctLetters, new Set(gameState.guessedLetters));

      // Broadcast updated game state to both players
      horolezciNamespace.to(gameId).emit("newRound", gameState);
    })

    socket.on("disconnect", () => {
      // Optionally, you can handle cleanup or notify other players
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
          horolezciGameData.delete(gameId);
          GameRoomsMap.delete(gameId);
        }
      }
    });
  });

  console.log("Horolezci namespace initialized.");
}
