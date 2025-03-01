package com.tarnai.duelovky.friendShips.entity;

import java.io.Serializable;

public class FriendShipId implements Serializable {
    private Long user1;
    private Long user2;

    public FriendShipId() {}

    public FriendShipId(Long user1, Long user2) {
        this.user1 = user1;
        this.user2 = user2;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FriendShipId that = (FriendShipId) o;
        return user1.equals(that.user1) && user2.equals(that.user2) || user1.equals(that.user2) && user2.equals(that.user1);
    }

    @Override
    public int hashCode() {
        return user1.hashCode() + user2.hashCode();
    }
}
