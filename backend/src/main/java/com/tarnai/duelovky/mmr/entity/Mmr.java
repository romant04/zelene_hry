package com.tarnai.duelovky.mmr.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.users.entity.Player;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "player_mmrs")
@Getter
@Setter
@IdClass(MmrId.class)
@AllArgsConstructor
@NoArgsConstructor
public class Mmr {
    @Id
    @ManyToOne
    @JoinColumn(name = "player_user_id", referencedColumnName = "user_id")
    private Player user;

    @Id
    @ManyToOne
    @JoinColumn(name = "game_id", referencedColumnName = "game_id")
    private Game game;

    @Column(name = "mmr", nullable = false)
    private Integer mmr;
}
