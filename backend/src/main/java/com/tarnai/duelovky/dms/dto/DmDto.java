package com.tarnai.duelovky.dms.dto;

import com.tarnai.duelovky.dms.entity.DirectMessage;
import com.tarnai.duelovky.users.dto.AccountDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class DmDto {
    private Long dmId;
    private AccountDto sender;
    private AccountDto receiver;
    private String message;
    private Date createdAt;

    public DmDto(DirectMessage directMessage) {
        this.dmId = directMessage.getDmId();
        this.sender = new AccountDto(directMessage.getSender());
        this.receiver = new AccountDto(directMessage.getReceiver());
        this.message = directMessage.getMessage();
        this.createdAt = directMessage.getCreatedAt();
    }
}
