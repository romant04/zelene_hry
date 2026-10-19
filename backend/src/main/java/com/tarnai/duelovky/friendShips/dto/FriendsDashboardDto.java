package com.tarnai.duelovky.friendShips.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FriendsDashboardDto {
    private Long currentUserId;
    private List<FriendShipDto> friendships;
}
