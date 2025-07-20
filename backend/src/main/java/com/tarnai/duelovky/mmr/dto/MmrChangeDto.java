package com.tarnai.duelovky.mmr.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MmrChangeDto {
    @NotNull
    private Long userId;
    @NotNull
    private Long gameId;
    @NotNull
    private Integer mmr;

    @NotBlank
    private String MMR_SECRET;
}
