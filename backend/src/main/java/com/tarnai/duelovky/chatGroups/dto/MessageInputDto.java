package com.tarnai.duelovky.chatGroups.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageInputDto {
    @NotBlank
    private String message;

    public MessageInputDto() {
        // Default constructor for deserialization
    }

    public MessageInputDto(String message) {
        this.message = message;
    }
}
