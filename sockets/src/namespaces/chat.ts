import { Server, Socket } from "socket.io";
import { Message } from "../types/message";
import { getClientId } from "../utils/getClient";
import { deliverToUser } from "../utils/deliverToUser";
import { createNotification } from "./notification";

const NAMESPACE = "/chat";
export function setupChatNamespace(io: Server) {
  const chatNamespace = io.of(NAMESPACE);

  chatNamespace.on("connection", (socket: Socket) => {
    const userId = socket.handshake.auth?.userId;
    const friendId = socket.handshake.auth?.friendId;

    if (!userId || !friendId) {
      console.log("Missing userId or friendId, disconnecting...");
      socket.disconnect();
      return;
    }

    socket.data.userId = userId;

    // Generate a unique room name based on sorted user IDs
    const roomId = [userId, friendId].sort().join("_");
    socket.join(roomId);

    // Handle messages within the room
    socket.on("sendMessage", async (message: Message) => {
      const userSocketId = await getClientId(io, NAMESPACE, userId);

      if (!userSocketId) {
        console.log(
          `No socket ID found for user ${userId}, cannot send message.`,
        );
        return;
      }

      // We notify the sender everytime
      chatNamespace.to(userSocketId).emit("receiveMessage", message);

      await deliverToUser(
        io,
        NAMESPACE,
        friendId,
        "receiveMessage",
        message,
        () =>
          createNotification(
            `Obdrželi jste novou zprávu od uživatele ${message.sender.username}`,
            friendId,
            `/chat/dms`,
            "DM",
          ),
      );
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} left room ${roomId}`);
    });
  });

  console.log("Chat namespace initialized.");
}
