package com.tarnai.duelovky.dms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DmInputDto {
    @NotNull(message = "ReceiverId nesmí být prázdný")
    private Long receiverId;
    @NotBlank(message = "Zpráva nesmí být prázdná")
    private String message;
}
