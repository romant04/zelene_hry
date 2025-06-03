import { Server, Socket } from "socket.io";
import { FriendRequest } from "../types/friendRequest";
import { getClientId } from "../utils/getClient";
import { Friendship } from "../types/friendship";
import { User } from "../types/user";
import { emitOrNotify } from "../utils/emitOrNotify";
import { NotificationMessage } from "../types/notificationMessage";

const NAMESPACE = "/friends";
export function setupFriendsNamespace(io: Server) {
    const friendsNamespace = io.of(NAMESPACE);

    friendsNamespace.on("connection", (socket: Socket) => {
        const userId = socket.handshake.auth?.userId;
        if (!userId) {
            console.log("Missing userId, disconnecting...");
            socket.disconnect();
            return;
        }

        socket.data.userId = userId;

        // Emit to the other user when his friend request is accepted
        socket.on("friendRequestAccepted", async (data: {friendRequest: FriendRequest, newFriend: Friendship}) => {
            const senderId = await getClientId(io, NAMESPACE, data.friendRequest.sender.id);

            const message: NotificationMessage = {
                message: `Vaše žádost o přátelství uživateli ${data.friendRequest.receiver.username} byla akecptovaná.`,
                redirectUrl: `/pratele`,
                timestamp: new Date()
            }

            await emitOrNotify(`user.${data.friendRequest.sender.id}.friend.request`, senderId, message, () => {
                friendsNamespace.to(senderId!).emit("friendRequestAccepted", data); // We can use ! here because the function is called only when senderId is defined inside the emitOrNotify function
            })
        });
        // Emit to the other user when his friend request is rejected
        socket.on("friendRequestRejected", async (friendRequest: FriendRequest) => {
            const senderId = await getClientId(io, NAMESPACE, friendRequest.sender.id);

            const message: NotificationMessage = {
                message: `Váše žádost o přátelství uživateli ${friendRequest.receiver.username} byla zamítnuta.`,
                redirectUrl: `/pratele`,
                timestamp: new Date()
            }

            await emitOrNotify(`user.${friendRequest.sender.id}.friend.request`, senderId, message, () => {
                friendsNamespace.to(senderId!).emit("friendRequestRejected", friendRequest); // We can use ! here because the function is called only when senderId is defined inside the emitOrNotify function
            })
        });

        // Emit to the other user when a new friend request is sent (here the sender knows about it but not the receiver)
        socket.on("friendRequestSent", async (friendRequest: FriendRequest) => {
            const receiverId = await getClientId(io, NAMESPACE, friendRequest.receiver.id);

            const message: NotificationMessage = {
                message: `${friendRequest.sender.username} vám poslal žádost o přátelství.`,
                redirectUrl: `/pratele`,
                timestamp: new Date()
            }

            await emitOrNotify(`user.${friendRequest.receiver.id}.friend.request`, receiverId, message, () => {
                friendsNamespace.to(receiverId!).emit("friendRequestSent", friendRequest);
            })

        })

        // Emit to the other user when friendship ends
        socket.on("friendRemoved", async (data: {friend: number, user: User}) => {
            const friendId = await getClientId(io, NAMESPACE, data.friend);

            const message: NotificationMessage = {
                message: `${data.user.username} si vás odebral z přátel.`,
                redirectUrl: `/pratele`,
                timestamp: new Date()
            }

            await emitOrNotify(`user.${data.friend}.friend.removed`, friendId, message, () => {
                friendsNamespace.to(friendId!).emit("friendRemoved", data.user);
            })

        })
    });

    console.log("Friends namespace initialized.");
}
