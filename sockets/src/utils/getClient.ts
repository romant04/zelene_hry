import { Server } from "socket.io";

export async function getClientId(io: Server, namespace: string, userId: number): Promise<string | null> {
    const sockets = await io.of(namespace).fetchSockets();
    return sockets.find(socket => socket.data.userId === userId)?.id || null;
}