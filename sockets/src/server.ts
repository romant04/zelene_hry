import http from "http";
import express from "express";
import { setupSocket } from "./socket";
import { initWords, isValidWord } from "./services/wordsStore";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initWords(); // Load words before starting the server

  // Initialize socket.io in a separate module
  setupSocket(server);

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

void startServer();
