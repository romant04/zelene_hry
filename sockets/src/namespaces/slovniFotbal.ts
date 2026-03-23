import { Server, Socket } from "socket.io";
import {
  GameData,
  SlovniFotbalGameState,
  SlovniFotbalPlayer,
} from "../types/game";
import { GameRoomsMap } from "../socket";
import { isValidWord } from "../services/wordsStore";

const NAMESPACE = "/slovniFotbal";
const SlovniFotbalGameData = new Map<string, SlovniFotbalGameState>();
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
      });
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
      console.log("getting this game state: " + gameState.players);
      slovniFotbalNamespace.to(socket.id).emit("gameState", gameState);
    });

    socket.on("guessWord", (word: string) => {
      const isCorrect =
        isValidWord(word) &&
        !player?.alreadyUsedWords.includes(word.toLowerCase());

      if (!isCorrect) {
        socket.emit("guessResult", { correct: false, message: "Invalid word" });
        return;
      }

      player?.alreadyUsedWords.push(word.toLowerCase());
      player!.score += 1; // Increment score for a correct guess
      // ? How will the goals logic work? Is it even necessary?
      // ? Maybe we can just have the score
      socket.emit("guessResult", { correct: true, message: "Correct guess!" });
      // also notify the other player that the enemy has guessed a word
      socket.to(gameId).emit("enemyGuessed", { word, score: player?.score });
    });

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
          console.log(
            `All players disconnected, removing game data for gameId: ${gameId}`,
          );
        }
      }
    });
  });

  console.log("Prší namespace initialized.");
}
