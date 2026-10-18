package com.tarnai.duelovky.games.dto;

import com.tarnai.duelovky.games.entity.GameCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameCategoryDto {
    private Long gameCategoryId;
    private String name;

    public GameCategoryDto(GameCategory gameCategory, String locale) {
        this.gameCategoryId = gameCategory.getGameCategoryId();
        this.name = gameCategory.resolveName(locale);
    }
}
