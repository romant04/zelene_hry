package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.FriendRequest;
import com.tarnai.duelovky.users.dto.AccountMinimumDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class FriendRequestDto {
    private AccountMinimumDto sender;
    private AccountMinimumDto receiver;
    private String message;
    private Date sentAt;

    public FriendRequestDto(FriendRequest friendRequest) {
        this.sender = new AccountMinimumDto(friendRequest.getSender());
        this.receiver = new AccountMinimumDto(friendRequest.getReceiver());
        this.message = friendRequest.getMessage();
        this.sentAt = friendRequest.getSentAt();
    }
}
