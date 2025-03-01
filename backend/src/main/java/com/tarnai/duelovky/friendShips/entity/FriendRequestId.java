package com.tarnai.duelovky.friendShips.entity;

import java.io.Serializable;
import java.util.Objects;

public class FriendRequestId implements Serializable {
    private Long sender;
    private Long receiver;

    public FriendRequestId() {}

    public FriendRequestId(Long sender, Long receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FriendRequestId that = (FriendRequestId) o;
        return Objects.equals(sender, that.sender) &&
                Objects.equals(receiver, that.receiver);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sender, receiver);
    }
}
