package com.tarnai.duelovky.socialDashboard.services;

import com.tarnai.duelovky.friendShips.dto.FriendRequestDto;
import com.tarnai.duelovky.friendShips.dto.FriendShipDto;
import com.tarnai.duelovky.friendShips.services.FriendRequestService;
import com.tarnai.duelovky.friendShips.services.FriendShipService;
import com.tarnai.duelovky.socialDashboard.dto.SocialDashboardDTO;
import com.tarnai.duelovky.users.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialAggregatorService {
    private final FriendShipService friendShipService;
    private final FriendRequestService friendRequestService;

    @Autowired
    public SocialAggregatorService(FriendShipService friendShipService, FriendRequestService friendRequestService) {
        this.friendShipService = friendShipService;
        this.friendRequestService = friendRequestService;
    }

    public SocialDashboardDTO getSocialDashboardData(Account account) {
        List<FriendShipDto> friendships = friendShipService.getUsersFriends(account).stream().map(FriendShipDto::new).toList();
        List<FriendRequestDto> friendRequests = friendRequestService.getUserFriendRequest(account).stream().map(FriendRequestDto::new).toList();

        return new SocialDashboardDTO(account.getId(), friendships, friendRequests);
    }
}
