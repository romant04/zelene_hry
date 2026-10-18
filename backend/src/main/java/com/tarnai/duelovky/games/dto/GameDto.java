package com.tarnai.duelovky.games.dto;

import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.games.entity.GameTranslation;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GameDto {
    private Long gameId;
    private String code;
    private String name;
    private String perex;
    private String description;
    private List<GameInfoDto> gameInfo;
    private List<GameCategoryDto> gameCategories;

    public GameDto(Game game, String locale) {
        this.gameId = game.getGameId();
        this.code = game.getCode();

        GameTranslation translation = game.resolveTranslation(locale);
        if (translation != null) {
            this.name = translation.getName();
            this.perex = translation.getPerex();
            this.description = translation.getDescription();
        } else {
            this.name = game.getName();
            this.perex = game.getPerex();
            this.description = game.getDescription();
        }

        this.gameInfo = game.getGameInfo().stream()
                .map(info -> new GameInfoDto(info, locale))
                .toList();
        this.gameCategories = game.getGameCategories().stream()
                .map(category -> new GameCategoryDto(category, locale))
                .toList();
    }
}
