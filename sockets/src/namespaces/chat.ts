import { Server, Socket } from "socket.io";
import { Message } from "../types/message";

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

    // Generate a unique room name based on sorted user IDs
    const roomId = [userId, friendId].sort().join("_");
    socket.join(roomId);

    console.log(`User ${userId} joined room ${roomId}`);

    // Handle messages within the room
    socket.on("sendMessage", (message: Message) => {
      console.log(`Message in ${roomId}:`, message.message);

      chatNamespace.to(roomId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} left room ${roomId}`);
    });
  });

  console.log("Chat namespace initialized.");
}
