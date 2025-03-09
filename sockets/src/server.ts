import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (change for security)
    },
});

// Middleware
app.use(cors());
app.get("/", (req, res) => {
    res.send("Socket.io server is running!");
});

// Handle socket connections
io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle messages
    socket.on("message", (data) => {
        console.log(`Message from ${socket.id}: ${data}`);
        io.emit("message", data); // Broadcast to all clients
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
