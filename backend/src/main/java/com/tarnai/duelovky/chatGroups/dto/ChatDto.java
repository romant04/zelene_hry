package com.tarnai.duelovky.chatGroups.dto;

import com.tarnai.duelovky.chatGroups.entity.Chat;
import com.tarnai.duelovky.users.dto.AccountDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class ChatDto {
    private Long chatId;
    private String name;
    private boolean isPublic;
    private Set<AccountDto> users;

    public ChatDto() {
    }

    public ChatDto(Chat chat) {
        this.chatId = chat.getChatId();
        this.name = chat.getName();
        this.isPublic = chat.isPublic();
        this.users = chat.getUsers().stream()
                .map(AccountDto::new)
                .collect(java.util.stream.Collectors.toSet());
    }
}
