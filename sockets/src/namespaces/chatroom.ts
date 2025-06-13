import { Server, Socket } from "socket.io";
import { Message } from "../types/message";
import { getClientId } from "../utils/getClient";
import { v4 as uuidv4 } from "uuid";
import { NotificationMessage } from "../types/notificationMessage";
import { emitOrNotify } from "../utils/emitOrNotify";
import { User } from "../types/user";
import { Chatroom } from "../types/chat";

const users = new Map<number, User>();
const NAMESPACE = "/chatroom";
export function setupChatroomNamespace(io: Server) {
    const chatroomNamespace = io.of("/chatroom");

    chatroomNamespace.on("connection", (socket: Socket) => {
        const user: User = socket.handshake.auth?.user;
        const chatId = socket.handshake.auth?.chatId;
        const usr: User[] = socket.handshake.auth?.users;

        if (usr) {
            usr.forEach((u: User) => {
                users.set(u.id, u);
            });
        }
        users.set(user.id, user);

        if (!user || !chatId) {
            console.log("Missing userId or chatId, disconnecting...");
            socket.disconnect();
            return;
        }

        socket.data.userId = user.id;

        // Generate a unique room name based on sorted user IDs
        const roomId = 'chatroom_' + chatId;
        socket.join(roomId);

        // Handle messages within the room
        socket.on("sendMessage", async (data: {message: Message, room: Chatroom}) => {
            const userSocketId = await getClientId(io, NAMESPACE, user.id);

            if (!userSocketId) {
                console.log(`No socket ID found for user ${user.id}, cannot send message.`);
                return;
            }

            const notificationMessage: NotificationMessage = {
                id: uuidv4(),
                message: `Nová zpráva v chatovací místnosti ${data.room.name} od uživatele ${data.message.sender.username}`,
                redirectUrl: `/chat/rooms`,
                timestamp: new Date(),
            };

            // We notify the sender everytime
            chatroomNamespace.to(userSocketId).emit("receiveMessage", data);

            for (const [id, _] of users) {
                if (id === user.id) {
                    continue; // Skip the sender
                }

                // We need to handle this one by one, because we don't know which user is online
                const friendSocketId = await getClientId(io, NAMESPACE, id);
                await emitOrNotify(`room.${chatId}`, friendSocketId, notificationMessage, () => {
                    chatroomNamespace.to(friendSocketId!).emit("receiveMessage", data);
                });
            }
        });
    });

    console.log("Chat namespace initialized.");
}
