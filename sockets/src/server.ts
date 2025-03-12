import http from "http";
import express from "express";
import { setupSocket } from "./socket";

const app = express();
const server = http.createServer(app);

// Initialize socket.io in a separate module
setupSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
