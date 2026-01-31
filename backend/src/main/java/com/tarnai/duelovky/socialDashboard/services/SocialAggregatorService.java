package com.tarnai.duelovky.socialDashboard.services;

import com.tarnai.duelovky.friendShips.dto.FriendRequestDto;
import com.tarnai.duelovky.friendShips.dto.FriendShipDto;
import com.tarnai.duelovky.friendShips.entity.Friendship;
import com.tarnai.duelovky.friendShips.services.FriendRequestService;
import com.tarnai.duelovky.friendShips.services.FriendShipService;
import com.tarnai.duelovky.socialDashboard.dto.SocialDashboardDTO;
import com.tarnai.duelovky.users.dto.AccountDto;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialAggregatorService {
    private final FriendShipService friendShipService;
    private final FriendRequestService friendRequestService;
    private final UserService userService;

    @Autowired
    public SocialAggregatorService(FriendShipService friendShipService, FriendRequestService friendRequestService, UserService userService) {
        this.friendShipService = friendShipService;
        this.friendRequestService = friendRequestService;
        this.userService = userService;
    }

    public SocialDashboardDTO getSocialDashboardData(Account account) {
        List<FriendShipDto> friendships = friendShipService.getUsersFriends(account).stream().map(FriendShipDto::new).toList();
        List<FriendRequestDto> friendRequests = friendRequestService.getUserFriendRequest(account).stream().map(FriendRequestDto::new).toList();
        List<AccountDto> suggestedFriends = userService.getUsersBySearchTerm("").stream().map(AccountDto::new).toList();

        return new SocialDashboardDTO(friendships, friendRequests, suggestedFriends);
    }
}
