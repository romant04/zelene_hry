package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.Friendship;
import com.tarnai.duelovky.users.dto.AccountDto;

import java.util.Date;

public class FriendShipDto {
    private AccountDto user1;
    private AccountDto user2;
    private Date startAt;

    public FriendShipDto() {
    }

    public FriendShipDto(AccountDto user1, AccountDto user2, Date startAt) {
        this.user1 = user1;
        this.user2 = user2;
        this.startAt = startAt;
    }

    public FriendShipDto(Friendship friendship) {
        this.user1 = new AccountDto(friendship.getUser1());
        this.user2 = new AccountDto(friendship.getUser2());
        this.startAt = friendship.getStartAt();
    }

    public AccountDto getUser1() {
        return user1;
    }

    public void setUser1(AccountDto user1) {
        this.user1 = user1;
    }

    public AccountDto getUser2() {
        return user2;
    }

    public void setUser2(AccountDto user2) {
        this.user2 = user2;
    }

    public Date getStartAt() {
        return startAt;
    }

    public void setStartAt(Date startAt) {
        this.startAt = startAt;
    }
}
