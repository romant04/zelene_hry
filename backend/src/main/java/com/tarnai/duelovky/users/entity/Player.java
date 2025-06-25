package com.tarnai.duelovky.users.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    @JsonManagedReference
    private Account account;

    public Player(Integer playTime) {
        this.playTime = playTime;
    }
}
