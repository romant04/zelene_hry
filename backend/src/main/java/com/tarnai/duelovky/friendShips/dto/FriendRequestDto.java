package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.FriendRequest;
import com.tarnai.duelovky.users.dto.AccountDto;

import java.util.Date;

public class FriendRequestDto {
    private AccountDto sender;
    private AccountDto receiver;
    private String message;
    private Date sentAt;

    public FriendRequestDto() {
    }

    public FriendRequestDto(FriendRequest friendRequest) {
        this.sender = new AccountDto(friendRequest.getSender());
        this.receiver = new AccountDto(friendRequest.getReceiver());
        this.message = friendRequest.getMessage();
        this.sentAt = friendRequest.getSentAt();
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

    public Date getSentAt() {
        return sentAt;
    }

    public void setSentAt(Date sentAt) {
        this.sentAt = sentAt;
    }
}
