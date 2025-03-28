package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.FriendRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestInputDto {
    private Long receiverId;
    private String message;
}
