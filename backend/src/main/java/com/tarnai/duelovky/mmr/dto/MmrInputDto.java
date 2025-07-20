package com.tarnai.duelovky.mmr.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MmrInputDto {
    @NotNull
    private Long userId;
    @NotNull
    private Long gameId;
}
