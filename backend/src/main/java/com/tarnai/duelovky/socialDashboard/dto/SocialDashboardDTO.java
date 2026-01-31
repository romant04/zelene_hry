package com.tarnai.duelovky.socialDashboard.dto;

import com.tarnai.duelovky.friendShips.dto.FriendRequestDto;
import com.tarnai.duelovky.friendShips.dto.FriendShipDto;
import com.tarnai.duelovky.users.dto.AccountDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SocialDashboardDTO {
    private List<FriendRequestDto> friendRequests;
    private List<FriendShipDto> friendships;
    private List<AccountDto> suggestedFriends;

    public SocialDashboardDTO(List<FriendShipDto> friendShipDto, List<FriendRequestDto> friendRequestDto, List<AccountDto> accountDto) {
        friendships = friendShipDto;
        friendRequests = friendRequestDto;
        suggestedFriends = accountDto;
    }
}
