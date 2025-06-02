package com.tarnai.duelovky.friendShips.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestInputDto {
    @NotNull
    private Long receiverId;
    @Size(max = 300)
    private String message;
}
