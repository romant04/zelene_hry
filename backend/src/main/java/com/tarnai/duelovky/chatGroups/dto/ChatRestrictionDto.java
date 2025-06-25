package com.tarnai.duelovky.chatGroups.dto;

import com.tarnai.duelovky.chatGroups.entity.ChatRestriction;
import com.tarnai.duelovky.users.dto.AccountDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ChatRestrictionDto {
    private Long chatId;
    private Long userId;
    private String reason;
    private Date startAt;
    private Date endAt;
    private AccountDto admin;

    public ChatRestrictionDto() {}

    public ChatRestrictionDto(ChatRestriction chatRestriction) {
        this.chatId = chatRestriction.getChatId();
        this.userId = chatRestriction.getUserId();
        this.reason = chatRestriction.getReason();
        this.startAt = chatRestriction.getStartAt();
        this.endAt = chatRestriction.getEndDate();
        if (chatRestriction.getAdmin() != null && chatRestriction.getAdmin().getAccount() != null) {
            this.admin = new AccountDto(chatRestriction.getAdmin().getAccount());
        } else {
            this.admin = null;
        }
    }
}
