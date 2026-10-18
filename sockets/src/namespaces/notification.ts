import { Server, Socket } from "socket.io";
import { Notification, NotificationInput } from "../types/notificationMessage";
import { getClientId } from "../utils/getClient";

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

    socket.on("receiveNotification", (notification: Notification) => {
      console.log(
        `User ${userId} received notification: ${notification.messageKey ?? notification.message}`,
      );
      socket.emit("receiveNotification", notification);
    });
  });

  console.log("Notification namespace initialized.");
}

export async function notifyUser(io: Server, notification: Notification) {
  const recipientId = notification.user.id;
  const recipientSocketId = await getClientId(io, NAMESPACE, recipientId);

  if (!recipientSocketId) {
    return;
  }

  io.of(NAMESPACE)
    .to(recipientSocketId)
    .emit("receiveNotification", notification);
}

export async function createNotification(
  userId: number,
  redirectUrl: string,
  type: string,
  messageKey: string,
  messageParams: Record<string, string | number> = {},
): Promise<Notification> {
  const message: NotificationInput = {
    messageKey,
    messageParams: JSON.stringify(messageParams),
    type,
    redirectUrl,
    userId,
    mmrSecret: process.env.MMR_SECRET!,
  };
  const res = await fetch(`${process.env.API_URL}/api/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  return (await res.json()) as Notification;
}
