package com.tarnai.duelovky.chatGroups.dto;

import com.tarnai.duelovky.chatGroups.entity.Chat;
import com.tarnai.duelovky.users.dto.AccountMinimumDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class ChatDto {
    private Long id;
    private String name;
    private boolean isPublic;
    private Set<AccountMinimumDto> users;

    public ChatDto() {
    }

    public ChatDto(Chat chat) {
        this.id = chat.getChatId();
        this.name = chat.getName();
        this.isPublic = chat.isPublic();
        this.users = chat.getUsers().stream()
                .map(AccountMinimumDto::new)
                .collect(Collectors.toSet());
    }
}
