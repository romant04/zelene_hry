package com.tarnai.duelovky.friendShips.entity;

import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "friend_requests")
@IdClass(FriendRequestId.class)
public class FriendRequest {
    @Id
    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "user_id")
    private Account sender;

    @Id
    @ManyToOne
    @JoinColumn(name = "receiver_id", referencedColumnName = "user_id")
    private Account receiver;

    @Column
    private String message;

    @Column(name = "sent_at")
    private Date sentAt;

    public FriendRequest() {
    }

    public FriendRequest(Account sender, Account receiver, String message, Date sentAt) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.sentAt = sentAt;
    }

    public Account getSender() {
        return sender;
    }

    public void setSender(Account sender) {
        this.sender = sender;
    }

    public Account getReceiver() {
        return receiver;
    }

    public void setReceiver(Account receiver) {
        this.receiver = receiver;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getSentAt() {
        return sentAt;
    }

    public void setSentAt(Date sentAt) {
        this.sentAt = sentAt;
    }
}
