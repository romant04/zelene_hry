package com.tarnai.duelovky.playerStats.dto;

import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.users.entity.Player;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerStatsDto {
    private Long userId;
    private Long gameId;
    private Integer gamesPlayed;
    private Double winRatio;

    public PlayerStatsDto(Player user, Game game, Integer gamesPlayed, Double winRatio) {
        this.userId = user.getId();
        this.gameId = game.getGameId();
        this.gamesPlayed = gamesPlayed;
        this.winRatio = winRatio;
    }
}
