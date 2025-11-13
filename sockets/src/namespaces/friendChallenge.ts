import { Server } from "socket.io";
import { User } from "../types/user";
import { v4 as uuidv4 } from "uuid";
import { GameData } from "../types/game";
import { GameRoomsMap } from "../socket";
import { getClientId } from "../utils/getClient";

interface FriendChallengeQueueUser {
  id: number;
  username: string;
  token: string;
  mmr: number;
  ready: boolean;
}
interface FriendChallengeQueue {
  queueCode: string;
  users: FriendChallengeQueueUser[];
  readyCounter: number;
  gameId: number;
}

const NAMESPACE = "/friend-challenge";
const activeQueues = new Map<string, FriendChallengeQueue>();

export function setupFriendChallengeNamespace(io: Server) {
  const friendChallengeNamespace = io.of(NAMESPACE);

  friendChallengeNamespace.on("connection", async (socket) => {
    const user: User = socket.handshake.auth?.user;
    const queueCode: string = socket.handshake.auth?.queueCode;
    const gameId: number = socket.handshake.auth?.gameId;

    if (!queueCode || !gameId) {
      console.log("Invalid connection information, disconnecting...");
      socket.disconnect();
      return;
    }

    socket.data.userId = user.id;

    console.log(
      `User ${user.username} connected to friend challenge with queue code ${queueCode}`,
    );

    if (activeQueues.get(queueCode)) {
      const queue = activeQueues.get(queueCode)!;
      // Check if user is already in the queue
      if (queue.users.find((u) => u.username === user.username)) {
        console.log(
          `User ${user.username} already in queue ${queueCode}, disconnecting...`,
        );
        socket.emit("alreadyInQueue");
        socket.disconnect();
        return;
      }

      // Check if queue is full
      if (queue.users.length >= 2) {
        console.log(
          `Queue ${queueCode} is full, disconnecting user ${user.username}...`,
        );
        socket.emit("queueFull");
        socket.disconnect();
        return;
      }

      // Add user to the queue
      queue.users.push({
        id: user.id,
        username: user.username,
        token: uuidv4(),
        mmr: user.player?.mmr.find((m) => m.gameId === gameId)?.mmr || 0,
        ready: true,
      });
      queue.readyCounter++;
      socket.join(queueCode);
      friendChallengeNamespace.to(queueCode).emit("queueUpdated", queue);

      if (queue.users.length === 2 && queue.readyCounter === 2) {
        const me = queue.users.find((u) => u.username === user.username)!;
        const enemy = queue.users.find((u) => u.username !== user.username)!;

        activeQueues.delete(queueCode);

        const roomKey = `${gameId}_${me.username}${enemy.username}`;
        const gameData: GameData = {
          roomKey: roomKey,
          isPrivate: true,
          players: [
            {
              id: me.id,
              name: me.username,
              token: me.token,
              mmr: me.mmr,
            },
            {
              id: enemy.id,
              name: enemy.username,
              token: enemy.token,
              mmr: enemy.mmr,
            },
          ],
        };
        GameRoomsMap.set(roomKey, gameData);

        // Notify both players that the game has started
        const enemySocketId = await getClientId(io, NAMESPACE, enemy.id);
        if (!enemySocketId) {
          console.log(`Match socket ID not found for user ${enemy.username}`);
          return;
        }
        friendChallengeNamespace.to(socket.id).emit("gameStarted", {
          gameId: roomKey,
          playerToken: me.token,
        });
        friendChallengeNamespace.to(enemySocketId).emit("gameStarted", {
          gameId: roomKey,
          playerToken: enemy.token,
        });
      }
    } else {
      const newQueue: FriendChallengeQueue = {
        queueCode,
        users: [
          {
            id: user.id,
            username: user.username,
            token: uuidv4(),
            mmr: user.player?.mmr.find((m) => m.gameId === gameId)?.mmr || 0,
            ready: true,
          },
        ],
        readyCounter: 1, // Players are ready by default upon joining (might change in future)
        gameId,
      };
      activeQueues.set(queueCode, newQueue);
      socket.join(queueCode);
    }

    socket.on("cancel", (queueCode: string, username: string) => {
      console.log("Cancel received for", queueCode, username);

      const queue = activeQueues.get(queueCode);
      if (!queue) return;
      const userIndex = queue.users.findIndex((u) => u.username === username);
      if (userIndex === -1) return;

      console.log(activeQueues);

      activeQueues.delete(queueCode);

      console.log(activeQueues);
    });

    // * This ready logic is currently not in use since the game starts as soon as both players join the queue
    // * Keeping it here for potential future use
    /*
    socket.on("ready", async (queueCode: string, username: string) => {
      const queue = activeQueues.get(queueCode);
      if (!queue) return;
      const user = queue.users.find((u) => u.username === username);
      if (!user || user.ready) return;
      user.ready = true;
      queue.readyCounter++;

      if (queue.readyCounter === 2) {
        const enemy = queue.users.find((u) => u.username !== username)!;
        activeQueues.delete(queueCode);

        const roomKey = `${gameId}_${user.username}${enemy.username}`;
        const gameData: GameData = {
          roomKey: roomKey,
          isPrivate: true,
          players: [
            {
              id: user.id,
              name: user.username,
              token: user.token,
              mmr: user.mmr,
            },
            {
              id: enemy.id,
              name: enemy.username,
              token: enemy.token,
              mmr: enemy.mmr,
            },
          ],
        };
        GameRoomsMap.set(roomKey, gameData);

        // Notify both players that the game has started
        const enemySocketId = await getClientId(io, NAMESPACE, enemy.id);
        if (!enemySocketId) {
          console.log(`Match socket ID not found for user ${enemy.username}`);
          return;
        }
        friendChallengeNamespace.to(socket.id).emit("gameStarted", {
          gameId: roomKey,
          playerToken: user.token,
        });
        friendChallengeNamespace.to(enemySocketId).emit("gameStarted", {
          gameId: roomKey,
          playerToken: enemy.token,
        });
      }
    });
    */
  });
}
