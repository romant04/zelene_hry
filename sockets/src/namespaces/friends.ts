import { Server, Socket } from "socket.io";
import { FriendRequest } from "../types/friendRequest";
import { getClientId } from "../utils/getClient";
import { Friendship } from "../types/friendship";
import {User} from "../types/user";

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

            if (!senderId) {
                // TODO: Create a notification system to notify the user that their friend request was accepted
                console.log(`User ${data.friendRequest.sender.id} not connected, cannot emit friend request accepted`);
                return;
            }

            friendsNamespace.to(senderId).emit("friendRequestAccepted", data);
        });
        // Emit to the other user when his friend request is rejected
        socket.on("friendRequestRejected", async (friendRequest: FriendRequest) => {
            const senderId = await getClientId(io, NAMESPACE, friendRequest.sender.id);

            if (!senderId) {
                // TODO: Create a notification system to notify the user that their friend request was accepted
                console.log(`User ${friendRequest.sender.id} not connected, cannot emit friend request accepted`);
                return;
            }

            friendsNamespace.to(senderId).emit("friendRequestRejected", friendRequest);
        });

        // Emit to the other user when a new friend request is sent (here the sender knows about it but not the receiver)
        socket.on("friendRequestSent", async (friendRequest: FriendRequest) => {
            const receiverId = await getClientId(io, NAMESPACE, friendRequest.receiver.id);

            if (!receiverId) {
                // TODO: Create a notification system to notify the user that their friend request was accepted
                console.log(`User ${friendRequest.sender.id} not connected, cannot emit friend request accepted`);
                return;
            }

            friendsNamespace.to(receiverId).emit("friendRequestSent", friendRequest);
        })

        // Emit to the other user when friendship ends
        socket.on("friendRemoved", async (data: {friend: number, user: User}) => {
            const friendId = await getClientId(io, NAMESPACE, data.friend);
            if (!friendId) {
                console.log(`User ${data.friend} not connected, cannot emit friend removed`);
                return;
            }

            friendsNamespace.to(friendId).emit("friendRemoved", data.user);
        })

        socket.on("disconnect", () => {
            console.log(`User ${userId} left room`);
        });
    });

    console.log("Friends namespace initialized.");
}
