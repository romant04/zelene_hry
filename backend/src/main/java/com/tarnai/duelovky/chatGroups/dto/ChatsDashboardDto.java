package com.tarnai.duelovky.chatGroups.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ChatsDashboardDto {
    private Long currentUserId;
    private List<ChatDto> chats;
}
