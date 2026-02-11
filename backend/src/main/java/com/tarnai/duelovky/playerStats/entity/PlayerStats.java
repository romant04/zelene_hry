package com.tarnai.duelovky.playerStats.entity;

import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.mmr.entity.MmrId;
import com.tarnai.duelovky.users.entity.Player;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "player_stats")
@Getter
@Setter
@IdClass(MmrId.class)
@AllArgsConstructor
@NoArgsConstructor
public class PlayerStats {
    @Id
    @ManyToOne
    @JoinColumn(name = "player_user_id", referencedColumnName = "user_id")
    private Player user;

    @Id
    @ManyToOne
    @JoinColumn(name = "game_id", referencedColumnName = "game_id")
    private Game game;

    @Column(name = "games_played")
    private Integer gamesPlayed;

    @Column(name = "play_time_minutes")
    private Integer playTimeMinutes;

    @Column(name = "win_ratio")
    private Double winRatio;
}
