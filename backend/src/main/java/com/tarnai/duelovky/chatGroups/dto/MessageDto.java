package com.tarnai.duelovky.chatGroups.dto;

import com.tarnai.duelovky.chatGroups.entity.Message;
import com.tarnai.duelovky.users.dto.AccountMinimumDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MessageDto {
    private long messageId;
    private String message;
    private AccountMinimumDto sender;
    private long chatId;
    private Date sentAt;

    public MessageDto(Message message) {
        this.messageId = message.getMessageId();
        this.message = message.getMessage();
        this.sender = new AccountMinimumDto(message.getUser());
        this.chatId = message.getChat().getChatId();
        this.sentAt = message.getSentAt();
    }
}
