import { Server, Socket } from "socket.io";
import { User } from "../types/user";
import { GameRoomsMap } from "../socket";
import { GameData } from "../types/game";
import { v4 as uuidv4 } from "uuid";
import { getClientId } from "../utils/getClient";

interface MatchmakingUser {
  id: number;
  username: string;
  mmr: number;
  margin: number;
  token: string;
}

const NAMESPACE = "/matchmaking";
const users = new Map<string, MatchmakingUser>();
const queueSize = new Map<number, number>();
const matchedUserIds = new Set<number>();

const MARGIN_INCREMENT = 20;
const MARGIN_INTERVAL = 5;

function getUsersFromSameGame(
  gameId: number,
  users: Map<string, MatchmakingUser>,
): MatchmakingUser[] {
  return [...users.entries()]
    .filter(([key]) => key.startsWith(`${gameId}_`))
    .map(([, value]) => value);
}

function canUsersMatch(userA: MatchmakingUser, userB: MatchmakingUser) {
  const withinMargin = (a: MatchmakingUser, b: MatchmakingUser) =>
    a.mmr + a.margin >= b.mmr && a.mmr - a.margin <= b.mmr;

  return withinMargin(userA, userB) && withinMargin(userB, userA);
}

export function setupMatchmakingNamespace(io: Server) {
  const matchmakingNamespace = io.of(NAMESPACE);

  matchmakingNamespace.on("connection", (socket: Socket) => {
    const user: User = socket.handshake.auth?.user;
    const gameId: number = socket.handshake.auth?.gameId;

    const mmrData = user?.player?.mmr.find((g) => g.gameId === gameId);

    if (users.get(`${gameId}_${user.id}`)) {
      console.log(
        `User ${user.username} already in matchmaking for game ${gameId}, disconnecting...`,
      );
      socket.emit("alreadyInMatchmaking");
      socket.disconnect();
      return;
    }

    if (!user || !gameId || !mmrData) {
      console.log("Invalid connection information, disconnecting...");
      socket.disconnect();
      return;
    }

    socket.data.userId = user.id;

    const key = `${gameId}_${user.id}`;
    const playerToken = uuidv4();

    users.set(key, {
      id: user.id,
      username: user.username,
      mmr: mmrData.mmr,
      margin: 0,
      token: playerToken,
    });

    const userData = users.get(key)!;
    let timer = 0;

    socket.emit("usersInQueue", queueSize.get(gameId) || 0);

    let interval: NodeJS.Timeout | null;
    socket.on("startMatchmaking", () => {
      queueSize.set(gameId, (queueSize.get(gameId) || 0) + 1);
      matchmakingNamespace.emit("usersInQueue", queueSize.get(gameId) || 0);

      interval = setInterval(async () => {
        const userArray = getUsersFromSameGame(gameId, users);
        timer++;

        if (timer >= MARGIN_INTERVAL) {
          userData.margin += MARGIN_INCREMENT;
          timer = 0;
        }

        const match = userArray
          .filter((u) => u.id !== userData.id && canUsersMatch(userData, u))
          .find((u) => !matchedUserIds.has(u.id));

        if (!match) return;

        if (matchedUserIds.has(userData.id)) {
          console.log(`User ${userData.username} already matched, skipping...`);
          return;
        }

        matchedUserIds.add(userData.id);
        matchedUserIds.add(match.id);

        console.log(`Matched ${userData.username} with ${match.username}`);
        clearInterval(interval!);
        interval = null;

        users.delete(key);
        users.delete(`${gameId}_${match.id}`);

        const roomKey = `${gameId}_${user.username}${match.username}`;

        const gameData: GameData = {
          roomKey: roomKey,
          players: [
            {
              id: user.id,
              name: user.username,
              token: playerToken,
              mmr: userData.mmr,
            },
            {
              id: match.id,
              name: match.username,
              token: match.token,
              mmr: match.mmr,
            },
          ],
        };
        GameRoomsMap.set(roomKey, gameData);
        queueSize.set(gameId, (queueSize.get(gameId) || 0) - 1); // We decrement just by one, because the other one will get decrement by disconnect

        const matchSocketId = await getClientId(io, NAMESPACE, match.id);
        if (!matchSocketId) {
          console.log(`Match socket ID not found for user ${match.username}`);
          return;
        }

        matchmakingNamespace.to(socket.id).emit("matchFound", {
          gameId: roomKey,
          playerToken,
        });
        matchmakingNamespace.to(matchSocketId).emit("matchFound", {
          gameId: roomKey,
          playerToken: match.token,
        });
      }, 1000);
    });

    socket.on("joinGame", () => {
      matchedUserIds.delete(userData.id);
    });

    socket.on("cancelMatchmaking", () => {
      console.log(
        `User ${userData.username} cancelled matchmaking for game ${gameId}`,
      );
      clearInterval(interval!);
      interval = null;
      users.delete(key);
      matchedUserIds.delete(userData.id);
      queueSize.set(gameId, (queueSize.get(gameId) || 0) - 1);
      matchmakingNamespace.emit("usersInQueue", queueSize.get(gameId) || 0);
    });

    socket.on("disconnect", () => {
      if (interval) {
        console.log(interval);
        console.log("queue decremented for user");
        queueSize.set(gameId, (queueSize.get(gameId) || 0) - 1);

        clearInterval(interval!);
      }
      users.delete(key);
      matchedUserIds.delete(userData.id);
    });
  });

  console.log("Matchmaking namespace initialized.");
}
