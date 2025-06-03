import { Server } from "socket.io";
import { createServer } from "http";
import { setupChatNamespace } from "./namespaces/chat";
import { setupFriendsNamespace } from "./namespaces/friends";
import {setupNotificationNamespace} from "./namespaces/notification";

export function setupSocket(server: ReturnType<typeof createServer>) {
  const io = new Server(server, {
    cors: { origin: "*" }, // Adjust this in production
  });

  // Attach each namespace
  setupChatNamespace(io);
  setupFriendsNamespace(io);
  setupNotificationNamespace(io);

  console.log("Socket.io initialized");
}
