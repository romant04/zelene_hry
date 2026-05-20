import { Server, Socket } from "socket.io";
import { FriendRequest } from "../types/friendRequest";
import { getClientId } from "../utils/getClient";
import { Friendship } from "../types/friendship";
import { User } from "../types/user";
import { createNotification, notifyUser } from "./notification";
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
              `Vaše žádost o přátelství uživateli ${data.friendRequest.receiver.username} byla akecptovaná.`,
              data.friendRequest.sender.id,
              "/pratele",
              "FRIENDS",
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
            `Vaše žádost o přátelství uživateli ${friendRequest.receiver.username} byla zamítnuta.`,
            friendRequest.sender.id,
            "/pratele",
            "FRIENDS",
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
            `${friendRequest.sender.username} vám poslal žádost o přátelství.`,
            friendRequest.receiver.id,
            "/pratele",
            "FRIENDS",
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
            `${data.user.username} si vás odebral z přátel.`,
            data.friend,
            "/pratele",
            "FRIENDS",
          ),
      );
    });
  });

  console.log("Friends namespace initialized.");
}
