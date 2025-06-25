package com.tarnai.duelovky.chatGroups.dto;

import com.tarnai.duelovky.users.dto.AccountDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRestrictionInputDto {
    @NotNull
    private Long userId;
    @NotBlank
    @Size(max = 100, message = "Důvod nesmí být delší než 100 znaků")
    private String reason;
    @Schema(type = "string", format = "date-time", description = "End date in ISO 8601 format (e.g., 2023-10-01T12:00:00Z). When null, the restriction is permanent.", example = "2023-06-20T12:00:00Z")
    private Date endDate; // When null, the restriction is permanent
}
