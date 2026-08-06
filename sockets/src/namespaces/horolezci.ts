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

export function setupSlovniFotbalNamespace(io: Server) {
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
          isConnected: true, // Mark the player as connected
        };
        return p;
      });

      horolezciGameData.set(gameId, {
        players,
        guessedLetters: [],
        correctLetters: Array.from(new Set(veta.toLowerCase().replace(/[^a-záčďéěíňóřšťúůýž]/g, ""))),
        secret: veta,
        pyramid: generatePyramid(Array.from(new Set(veta.toLowerCase().replace(/[^a-záčďéěíňóřšťúůýž]/g, ""))), new Set()),
        roundEndTime: Date.now() + ROUND_DURATION, // null = round not started yet
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
    // TODO: This should be a function triggered when round timer ends, not a socket event.
    socket.on("evaluateGuesses", () => {
        const distanceMultiplier = 50; // We do * 50 because the height is roughly 1500, and we want to make sure the player can reach the top of the pyramid in a reasonable number of rounds
        // Evaluate the guesses of both players
        const playerGuess = player!.lockedInGuess.letter.toLowerCase();
        const enemyGuess = enemy!.lockedInGuess.letter.toLowerCase();

        const numberOfPlayerGuessOccurrences = gameState.correctLetters.filter(x => x.toLowerCase() === playerGuess.toLowerCase()).length;
        if (numberOfPlayerGuessOccurrences > 0) {
            const distance = numberOfPlayerGuessOccurrences * player!.lockedInGuess.scoreMultiplier;
            player!.distanceTraveled += distance * distanceMultiplier;
        }

        const numberOfEnemyGuessOccurrences = gameState.correctLetters.filter(x => x.toLowerCase() === enemyGuess.toLowerCase()).length;
        if (numberOfEnemyGuessOccurrences > 0) {
            const distance = numberOfEnemyGuessOccurrences * enemy!.lockedInGuess.scoreMultiplier;
            enemy!.distanceTraveled += distance * distanceMultiplier;
        }

        // Reset locked in guesses for the next round
        player!.lockedInGuess = {letter: "", scoreMultiplier: 1};
        enemy!.lockedInGuess = {letter: "", scoreMultiplier: 1};

        // Broadcast updated game state to both players
        horolezciNamespace.to(gameId).emit("rounedEnded", gameState);
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
