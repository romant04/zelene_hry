package com.tarnai.duelovky.games.dto;

import com.tarnai.duelovky.games.entity.Game;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GameDto {
    private Long gameId;
    private String name;
    private String perex;
    private String description;
    private List<GameInfoDto> gameInfo;
    private List<GameCategoryDto> gameCategories;

    public GameDto(Game game) {
        this.gameId = game.getGameId();
        this.name = game.getName();
        this.perex = game.getPerex();
        this.description = game.getDescription();
        this.gameInfo = game.getGameInfo().stream()
                .map(GameInfoDto::new)
                .toList();
        this.gameCategories = game.getGameCategories().stream()
                .map(GameCategoryDto::new)
                .toList();
    }
}
