package com.tarnai.duelovky.playerStats.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PlayerStatsInputDto {
    @NotNull
    private Long userId;
    @NotNull
    private Long gameId;
    @NotNull
    private Integer gamesPlayed;
    @NotNull
    private Double winRatio;

    @NotBlank
    private String mmrSecret; // We can use the same secret as for MMR
}
