package com.tarnai.duelovky.dms.dto;

import com.tarnai.duelovky.dms.entity.DirectMessage;
import com.tarnai.duelovky.users.dto.AccountDto;

import java.util.Date;

public class DmDto {
    private Long dmId;
    private AccountDto sender;
    private AccountDto receiver;
    private String message;
    private Date createdAt;

    public DmDto(Long dmId, AccountDto sender, AccountDto receiver, String message, Date createdAt) {
        this.dmId = dmId;
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.createdAt = createdAt;
    }

    public DmDto() {
    }

    public DmDto(DirectMessage directMessage) {
        this.dmId = directMessage.getDmId();
        this.sender = new AccountDto(directMessage.getSender());
        this.receiver = new AccountDto(directMessage.getReceiver());
        this.message = directMessage.getMessage();
        this.createdAt = directMessage.getCreatedAt();
    }

    public Long getDmId() {
        return dmId;
    }

    public void setDmId(Long dmId) {
        this.dmId = dmId;
    }

    public AccountDto getSender() {
        return sender;
    }

    public void setSender(AccountDto sender) {
        this.sender = sender;
    }

    public AccountDto getReceiver() {
        return receiver;
    }

    public void setReceiver(AccountDto receiver) {
        this.receiver = receiver;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
