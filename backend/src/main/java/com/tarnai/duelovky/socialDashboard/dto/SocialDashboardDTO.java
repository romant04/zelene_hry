package com.tarnai.duelovky.socialDashboard.dto;

import com.tarnai.duelovky.friendShips.dto.FriendRequestDto;
import com.tarnai.duelovky.friendShips.dto.FriendShipDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SocialDashboardDTO {
    private Long currentUserId;
    private List<FriendRequestDto> friendRequests;
    private List<FriendShipDto> friendships;

    public SocialDashboardDTO(Long currentUserId, List<FriendShipDto> friendships, List<FriendRequestDto> friendRequests) {
        this.currentUserId = currentUserId;
        this.friendships = friendships;
        this.friendRequests = friendRequests;
    }
}
