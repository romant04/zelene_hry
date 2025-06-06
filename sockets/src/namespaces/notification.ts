import { Server, Socket } from "socket.io";
import {ackNotification, listenToNotifications} from "../utils/listenToNotifications";
import { NotificationMessage } from "../types/notificationMessage";
import { getClientId } from "../utils/getClient";

const NAMESPACE = "/notification";

const userNotificationQueues = new Map<string, Map<string, NotificationMessage>>(); // key: userId, value: Map<id, NotificationMessage>

function getUserQueue(userId: string) {
    if (!userNotificationQueues.has(userId)) {
        userNotificationQueues.set(userId, new Map());
    }
    return userNotificationQueues.get(userId) as Map<string, NotificationMessage>;
}

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
            const id = await getClientId(io, NAMESPACE, userId);
            if (!id) {
                console.log(`No client ID found for user ${userId}, cannot send notification.`);
                return;
            }
            const queue = getUserQueue(userId);
            queue.set(message.id, message);
            notificationNamespace.to(id).emit("notification", message);
        });

        socket.on('fetchNotifications', async () => {
            const id = await getClientId(io, NAMESPACE, userId);
            if (!id) {
                console.log(`No client ID found for user ${userId}, cannot fetch notifications.`);
                return;
            }

            const queue = getUserQueue(userId);

            const notifications = Array.from(queue.values());
            notificationNamespace.to(id).emit("notifications", notifications);
        })

        socket.on("ackAll", async () => {
            const id = await getClientId(io, NAMESPACE, userId);
            if (!id) {
                console.log(`No client ID found for user ${userId}, cannot acknowledge all notifications.`);
                return;
            }

            const queue = getUserQueue(userId);
            const notificationIds = Array.from(queue.keys());

            for (const notificationId of notificationIds) {
                queue.delete(notificationId);
                await ackNotification(notificationId);
            }
        })

        socket.on("ack", async (notificationsId: string[] | string) => {
            const id = await getClientId(io, NAMESPACE, userId);
            if (!id) {
                console.log(`No client ID found for user ${userId}, cannot fetch notifications.`);
                return;
            }

            const queue = getUserQueue(userId);

            if (typeof notificationsId === "string") {
                notificationsId = [notificationsId];
            }

            for (const id of notificationsId) {
                queue.delete(id);
                void ackNotification(id)
            }
        })
    });

    console.log("Notification namespace initialized.");
}
