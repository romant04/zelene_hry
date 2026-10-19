package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.Friendship;
import com.tarnai.duelovky.users.dto.AccountMinimumDto;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class FriendShipDto {
    @NotNull(message = "User1 nesmí být prázdný")
    private AccountMinimumDto user1;
    @NotNull(message = "User2 nesmí být prázdný")
    private AccountMinimumDto user2;
    @NotNull(message = "StartAt nesmí být prázdný")
    private Date startAt;

    public FriendShipDto(Friendship friendship) {
        this.user1 = new AccountMinimumDto(friendship.getUser1());
        this.user2 = new AccountMinimumDto(friendship.getUser2());
        this.startAt = friendship.getStartAt();
    }
}
