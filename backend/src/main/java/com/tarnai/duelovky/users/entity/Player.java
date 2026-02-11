package com.tarnai.duelovky.users.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tarnai.duelovky.mmr.entity.Mmr;
import com.tarnai.duelovky.playerStats.entity.PlayerStats;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity(name = "players")
@Getter
@Setter
@NoArgsConstructor
public class Player {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Account account;

    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @JsonManagedReference
    private List<Mmr> mmr;

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<PlayerStats> playerStats;
}
