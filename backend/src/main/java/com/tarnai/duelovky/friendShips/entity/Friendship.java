package com.tarnai.duelovky.friendShips.entity;

import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "friendships")
@IdClass(FriendShipId.class)
public class Friendship {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id1", referencedColumnName = "user_id")
    private Account user1;
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id2", referencedColumnName = "user_id")
    private Account user2;

    @Column(name = "start_at")
    private Date startAt;


    public Friendship() {
    }

    public Friendship(Account user1, Account user2, Date startAt) {
        this.user1 = user1;
        this.user2 = user2;
        this.startAt = startAt;
    }

    public Account getUser1() {
        return user1;
    }

    public void setUser1(Account user1) {
        this.user1 = user1;
    }

    public Account getUser2() {
        return user2;
    }

    public void setUser2(Account user2) {
        this.user2 = user2;
    }

    public Date getStartAt() {
        return startAt;
    }

    public void setStartAt(Date startAt) {
        this.startAt = startAt;
    }
}
