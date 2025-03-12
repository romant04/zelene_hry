import { Server } from "socket.io";
import { createServer } from "http";
import { setupChatNamespace } from "./namespaces/chat";

export function setupSocket(server: ReturnType<typeof createServer>) {
  const io = new Server(server, {
    cors: { origin: "*" }, // Adjust this in production
  });

  // Attach each namespace
  setupChatNamespace(io);

  console.log("Socket.io initialized");
}
