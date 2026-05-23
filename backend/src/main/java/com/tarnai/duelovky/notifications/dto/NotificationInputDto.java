package com.tarnai.duelovky.notifications.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationInputDto {
    @NotNull(message = "UserId nesmí být prázdný")
    private Long userId;
    @NotBlank(message = "Typ nesmí být prázdný")
    private String type;
    @NotBlank(message = "Zpráva nesmí být prázdný")
    private String message;

    @NotBlank(message = "RedirectUrl nesmí být prázdný")
    private String redirectUrl;

    @NotBlank
    private String mmrSecret; // We can use the same secret as for MMR
}
