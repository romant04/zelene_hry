package com.tarnai.duelovky.chatGroups.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatInputDto {
    @NotBlank
    private String name;
    @NotNull
    private boolean isPublic;

    public ChatInputDto() {
    }

    public ChatInputDto(String name, boolean isPublic) {
        this.name = name;
        this.isPublic = isPublic;
    }
}
