package com.tarnai.duelovky.dms.entity;

import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;

import java.util.Date;

@Entity(name = "direct_messages")
public class DirectMessage {
    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "user_id")
    private Account sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", referencedColumnName = "user_id")
    private Account receiver;

    @Column
    private String message;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "dm_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dmId;

    public DirectMessage(Account sender, Account receiver, String message, Date createdAt) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.createdAt = createdAt;
    }

    public DirectMessage() {
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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Long getDmId() {
        return dmId;
    }

    public void setDmId(Long dmId) {
        this.dmId = dmId;
    }
}
