package com.tarnai.duelovky.chatGroups.dto;

import com.tarnai.duelovky.chatGroups.entity.Message;
import com.tarnai.duelovky.users.dto.AccountDto;
import com.tarnai.duelovky.users.entity.Account;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MessageDto {
    private long messageId;
    private String message;
    private AccountDto sender;
    private long chatId;
    private Date sentAt;

    public MessageDto(Message message) {
        this.messageId = message.getMessageId();
        this.message = message.getMessage();
        this.sender = new AccountDto(message.getUser());
        this.chatId = message.getChat().getChatId();
        this.sentAt = message.getSentAt();
    }
}
