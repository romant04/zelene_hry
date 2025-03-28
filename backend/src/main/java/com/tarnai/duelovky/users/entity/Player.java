package com.tarnai.duelovky.users.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "players")
@Getter
@Setter
@NoArgsConstructor
public class Player {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "play_time")
    private Integer playTime;

    public Player(Integer playTime) {
        this.playTime = playTime;
    }
}
