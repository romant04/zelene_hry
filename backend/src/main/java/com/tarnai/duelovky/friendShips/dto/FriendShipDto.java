package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.Friendship;
import com.tarnai.duelovky.users.dto.AccountDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class FriendShipDto {
    private AccountDto user1;
    private AccountDto user2;
    private Date startAt;

    public FriendShipDto(Friendship friendship) {
        this.user1 = new AccountDto(friendship.getUser1());
        this.user2 = new AccountDto(friendship.getUser2());
        this.startAt = friendship.getStartAt();
    }
}
