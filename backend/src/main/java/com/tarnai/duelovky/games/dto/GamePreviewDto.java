package com.tarnai.duelovky.games.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GamePreviewDto {
    private Long gameId;
    private String code;
    private String name;
    private String perex;
    private List<GameCategoryDto> gameCategories;

    public GamePreviewDto(Long gameId, String code, String name, String perex,
                          List<GameCategoryDto> gameCategories) {
        this.gameId = gameId;
        this.code = code;
        this.name = name;
        this.perex = perex;
        this.gameCategories = gameCategories;
    }
}
