import { Server, Socket } from "socket.io";
import {
  GameData,
  SlovniFotbalGameState,
  SlovniFotbalPlayer,
} from "../types/game";
import { GameRoomsMap } from "../socket";
import { isValidWord } from "../services/wordsStore";
import {generateLetters} from "../utils/generateLetters";
import {calculateAndUpdateMMR} from "../utils/calculateAndUpdateMMR";

const NAMESPACE = "/slovniFotbal";
const GAME_DURATION = 3 * 60 * 1000;

const gameoverTimers = new Map<string, NodeJS.Timeout>();
const SlovniFotbalGameData = new Map<string, SlovniFotbalGameState>();

function scheduleGameOver(io: Server, namespace: any, gameId: string) {
  const existing = gameoverTimers.get(gameId);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    namespace.to(gameId).emit("gameover");
    gameoverTimers.delete(gameId);
  }, GAME_DURATION);

  gameoverTimers.set(gameId, timer);
}

export function setupSlovniFotbalNamespace(io: Server) {
  const slovniFotbalNamespace = io.of(NAMESPACE);

  slovniFotbalNamespace.on("connection", (socket: Socket) => {
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
      !SlovniFotbalGameData.has(gameId) ||
      !SlovniFotbalGameData.get(gameId)?.players
    ) {
      console.log(`Initializing game state for gameId: ${gameId}`);
      const players = generalGameData?.players.map((player) => {
        const p: SlovniFotbalPlayer = {
          id: player.id,
          name: player.name,
          token: player.token,
          score: 0,
          goals: 0,
          alreadyUsedWords: [],
          isConnected: true, // Mark the player as connected
        };
        return p;
      });

      SlovniFotbalGameData.set(gameId, {
        players,
        endTime: Date.now() + GAME_DURATION, // Set the end time to 3 minutes from now
        letters: generateLetters()
      });
      scheduleGameOver(io, slovniFotbalNamespace, gameId)
    }

    const gameState = SlovniFotbalGameData.get(gameId)!;
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

    slovniFotbalNamespace.to(socket.id).emit("gameState", gameState);

    socket.on("getGameState", () => {
      slovniFotbalNamespace.to(socket.id).emit("gameState", gameState);
    });

    socket.on("requestGameOverData", () => {
      const playerScore = (player!.score + player!.goals * 10) || 0;
      const enemyScore = (enemy!.score + enemy!.goals * 10) || 0;
      const draw = playerScore === enemyScore;

      socket.emit("gameoverData", playerScore > enemyScore ? player : playerScore < enemyScore ? enemy : null);
      socket.to(gameId).emit("gameoverData", playerScore > enemyScore ? player : playerScore < enemyScore ? enemy : null);

      void calculateAndUpdateMMR(gameId, player!.id, enemy!.id, draw);
      SlovniFotbalGameData.delete(gameId);
      return;
    })

    socket.on("guessWord", (word: string) => {
      const alreadyGuessed = player?.alreadyUsedWords.includes(word.toLowerCase());
      const isCorrect =
        isValidWord(word) &&
        !alreadyGuessed

      if (!isCorrect) {
        const message = alreadyGuessed ? `${word} již bylo použito` : `${word} nebylo nalezeno`;
        socket.emit("guessResult", { correct: false, message });
        return;
      }

      player?.alreadyUsedWords.push(word.toLowerCase());
      player!.score += word.length;
      socket.emit("guessResult", { correct: true, message: `+${word.length} skóre`, score: player?.score });
      // also notify the other player that the enemy has guessed a word
      socket.to(gameId).emit("enemyGuessed", { word, score: player?.score });
    });
    socket.on("goalScored", (newScore: number) => {
        if (player) {
            player.goals += 1;
            player.score = newScore; // Update the score based on the new score sent by the client
        }
        socket.to(gameId).emit("enemyGoalUpdate", { goals: player?.goals, score: player?.score });
    })

    socket.on("disconnect", () => {
      console.log(`User ${id} disconnected from Prší namespace.`);
      // Optionally, you can handle cleanup or notify other players
      const gameData = SlovniFotbalGameData.get(gameId);
      if (gameData) {
        if (player) {
          player.isConnected = false; // Mark the player as disconnected
        }
        slovniFotbalNamespace.to(gameId).emit("playerDisconnected", { id });

        if (
          gameData.players?.filter((player) => player.isConnected).length === 0
        ) {
          // If all players are disconnected, remove the game data
          SlovniFotbalGameData.delete(gameId);
          GameRoomsMap.delete(gameId);
          clearTimeout(gameoverTimers.get(gameId));
          gameoverTimers.delete(gameId);
          console.log(
            `All players disconnected, removing game data for gameId: ${gameId}`,
          );
        }
      }
    });
  });

  console.log("Slovní fotbal namespace initialized.");
}
