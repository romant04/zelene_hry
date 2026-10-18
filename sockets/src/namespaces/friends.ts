import { Server, Socket } from "socket.io";
import { FriendRequest } from "../types/friendRequest";
import { Friendship } from "../types/friendship";
import { User } from "../types/user";
import { createNotification } from "./notification";
import { deliverToUser } from "../utils/deliverToUser";

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
    socket.on(
      "friendRequestAccepted",
      async (data: { friendRequest: FriendRequest; newFriend: Friendship }) => {
        await deliverToUser(
          io,
          NAMESPACE,
          data.friendRequest.sender.id,
          "friendRequestAccepted",
          data,
          () =>
            createNotification(
              data.friendRequest.sender.id,
              "/pratele",
              "FRIENDS",
              "system.friendRequestAccepted",
              { username: data.friendRequest.receiver.username },
            ),
        );
      },
    );

    // Emit to the other user when his friend request is rejected
    socket.on("friendRequestRejected", async (friendRequest: FriendRequest) => {
      await deliverToUser(
        io,
        NAMESPACE,
        friendRequest.sender.id,
        "friendRequestRejected",
        friendRequest,
        () =>
          createNotification(
            friendRequest.sender.id,
            "/pratele",
            "FRIENDS",
            "system.friendRequestRejected",
            { username: friendRequest.receiver.username },
          ),
      );
    });

    // Emit to the other user when a new friend request is sent (here the sender knows about it but not the receiver)
    socket.on("friendRequestSent", async (friendRequest: FriendRequest) => {
      await deliverToUser(
        io,
        NAMESPACE,
        friendRequest.receiver.id,
        "friendRequestSent",
        friendRequest,
        () =>
          createNotification(
            friendRequest.receiver.id,
            "/pratele",
            "FRIENDS",
            "system.friendRequestReceived",
            { username: friendRequest.sender.username },
          ),
      );
    });

    // Emit to the other user when friendship ends
    socket.on("friendRemoved", async (data: { friend: number; user: User }) => {
      await deliverToUser(
        io,
        NAMESPACE,
        data.friend,
        "friendRemoved",
        data.user,
        () =>
          createNotification(
            data.friend,
            "/pratele",
            "FRIENDS",
            "system.friendRemoved",
            { username: data.user.username },
          ),
      );
    });
  });

  console.log("Friends namespace initialized.");
}
