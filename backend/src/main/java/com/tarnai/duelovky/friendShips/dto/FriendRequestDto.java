package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.FriendRequest;
import com.tarnai.duelovky.users.dto.AccountDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class FriendRequestDto {
    private AccountDto sender;
    private AccountDto receiver;
    private String message;
    private Date sentAt;

    public FriendRequestDto(FriendRequest friendRequest) {
        this.sender = new AccountDto(friendRequest.getSender());
        this.receiver = new AccountDto(friendRequest.getReceiver());
        this.message = friendRequest.getMessage();
        this.sentAt = friendRequest.getSentAt();
    }
}
