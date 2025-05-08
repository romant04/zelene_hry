package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.FriendRequest;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestInputDto {
    @NotNull
    private Long receiverId;
    @NotBlank
    @Size(max = 300)
    private String message;
}
