package com.tarnai.duelovky.chatGroups.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageInputDto {
    @NotBlank
    @Size(max = 300, message = "Zpráva nesmí být delší než 500 znaků.")
    private String message;

    public MessageInputDto() {
        // Default constructor for deserialization
    }

    public MessageInputDto(String message) {
        this.message = message;
    }
}
