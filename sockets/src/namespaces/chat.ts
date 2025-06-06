import { Server, Socket } from "socket.io";
import { Message } from "../types/message";
import { getClientId } from "../utils/getClient";
import { v4 as uuidv4 } from "uuid";
import { NotificationMessage } from "../types/notificationMessage";
import {emitOrNotify} from "../utils/emitOrNotify";

export function setupChatNamespace(io: Server) {
  const chatNamespace = io.of("/chat");

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
      const friendSocketId = await getClientId(io, "/chat", friendId);
      const userSocketId = await getClientId(io, "/chat", userId);

      if (!userSocketId) {
        console.log(`No socket ID found for user ${userId}, cannot send message.`);
        return;
      }

      const notificationMessage: NotificationMessage = {
        id: uuidv4(),
        message: `Obdrželi jste novou zprávu od uživatele ${message.sender.username}`,
        redirectUrl: `/chat`,
        timestamp: new Date(),
      };

      // We notify the sender everytime
      chatNamespace.to(userSocketId).emit("receiveMessage", message);

      await emitOrNotify(`user.${friendId}.chat.message`, friendSocketId, notificationMessage, () => {
        chatNamespace.to(friendSocketId!).emit("receiveMessage", message);
      });
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} left room ${roomId}`);
    });
  });

  console.log("Chat namespace initialized.");
}
