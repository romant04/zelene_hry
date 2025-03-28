package com.tarnai.duelovky.friendShips.entity;

import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "friendships")
@IdClass(FriendShipId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}
