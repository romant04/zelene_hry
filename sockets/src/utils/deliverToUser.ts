import { Server } from "socket.io";
import { getClientId } from "./getClient";
import { notifyUser } from "../namespaces/notification";
import { Notification } from "../types/notificationMessage";

export async function deliverToUser(
  io: Server,
  namespace: string,
  userId: number,
  event: string,
  payload: any,
  createNotification?: () => Promise<Notification>,
) {
  const socketId = await getClientId(io, namespace, userId);

  if (socketId) {
    io.of(namespace).to(socketId).emit(event, payload);
    return;
  }

  if (createNotification) {
    await notifyUser(io, await createNotification());
  }
}
