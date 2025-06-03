import { Server, Socket } from "socket.io";
import { listenToNotifications } from "../utils/listenToNotifications";
import { NotificationMessage } from "../types/notificationMessage";
import { getClientId } from "../utils/getClient";
// TODO: Notifications need some extra testing (persistent), also implement the frontend part and remove the .logs after
const NAMESPACE = "/notification";
export function setupNotificationNamespace(io: Server) {
    const notificationNamespace = io.of(NAMESPACE);

    notificationNamespace.on("connection", (socket: Socket) => {
        const userId = socket.handshake.auth?.userId;

        if (!userId) {
            console.log("Missing userId, disconnecting...");
            socket.disconnect();
            return;
        }

        socket.data.userId = userId;

        void listenToNotifications(`user.${userId}.#`, `friendQueue-${userId}`, async (message: NotificationMessage) => {
            console.log(`Received notification for user ${userId}:`, message);
            const id = await getClientId(io, NAMESPACE, userId);
            if (!id) {
                console.log(`No client ID found for user ${userId}, cannot send notification.`);
                return;
            }
            notificationNamespace.to(id).emit("notification", message);
        });
    });

    console.log("Chat namespace initialized.");
}
