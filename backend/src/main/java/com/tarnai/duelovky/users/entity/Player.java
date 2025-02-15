package com.tarnai.duelovky.users.entity;

import jakarta.persistence.*;

@Entity(name = "players")
public class Player {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "play_time")
    private Integer playTime;

    public Player() {
    }

    public Player(Integer playTime) {
        this.playTime = playTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPlayTime() {
        return playTime;
    }

    public void setPlayTime(Integer playTime) {
        this.playTime = playTime;
    }
}
