package com.tarnai.duelovky.notifications.dto;

import jakarta.validation.constraints.AssertTrue;
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

    /** Legacy fixed-language message. Prefer messageKey + messageParams. */
    private String message;

    private String messageKey;

    /** JSON object with interpolation params, e.g. {"username":"Roman"} */
    private String messageParams;

    @NotBlank(message = "RedirectUrl nesmí být prázdný")
    private String redirectUrl;

    @NotBlank
    private String mmrSecret; // We can use the same secret as for MMR

    @AssertTrue(message = "Either messageKey or message must be provided")
    public boolean isMessageOrKeyPresent() {
        boolean hasKey = messageKey != null && !messageKey.isBlank();
        boolean hasMessage = message != null && !message.isBlank();
        return hasKey || hasMessage;
    }
}
