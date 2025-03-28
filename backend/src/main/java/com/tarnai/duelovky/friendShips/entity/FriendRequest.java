package com.tarnai.duelovky.friendShips.entity;

import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "friend_requests")
@IdClass(FriendRequestId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}
