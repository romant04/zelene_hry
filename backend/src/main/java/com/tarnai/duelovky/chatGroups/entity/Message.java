package com.tarnai.duelovky.chatGroups.entity;

import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity(name = "messages")
@Getter
@Setter
public class Message {
    @Id
    @Column(name = "message_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @Column
    private String message;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Account user;

    @ManyToOne
    @JoinColumn(name = "chat_id", referencedColumnName = "chat_id")
    private Chat chat;

    @Column(name = "sent_at")
    private Date sentAt;

    public Message() {
        // Default constructor for JPA
    }

    public Message(String message, Account user, Chat chat, Date sentAt) {
        this.message = message;
        this.user = user;
        this.chat = chat;
        this.sentAt = sentAt;
    }
}
