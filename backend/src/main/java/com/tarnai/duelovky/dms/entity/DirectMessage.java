package com.tarnai.duelovky.dms.entity;

import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity(name = "direct_messages")
@Getter
@Setter
@NoArgsConstructor
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
}
