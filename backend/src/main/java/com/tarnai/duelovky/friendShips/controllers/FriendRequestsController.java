package com.tarnai.duelovky.friendShips.controllers;

import com.tarnai.duelovky.friendShips.dto.FriendRequestDto;
import com.tarnai.duelovky.friendShips.entity.FriendRequest;
import com.tarnai.duelovky.friendShips.services.FriendRequestService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/secured")
public class FriendRequestsController {
    private final FriendRequestService friendRequestService;
    private final UserService userService;

    @Autowired
    public FriendRequestsController(FriendRequestService friendRequestService, UserService userService, UserService userService1) {
        this.friendRequestService = friendRequestService;
        this.userService = userService1;
    }

    @GetMapping("/friendRequests")
    public List<FriendRequestDto> getAllFriendRequests() {
        return friendRequestService.getAllFriendRequests().stream().map(FriendRequestDto::new).toList();
    }

    @PostMapping("/friendRequest")
    public ResponseEntity<ErrorResponse> sendFriendRequest(@RequestBody FriendRequestDto friendRequestDto, Authentication authentication) {
        Account sender = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);
        Optional<Account> receiver = userService.getUserById(friendRequestDto.getReceiverId());

        if (sender == null || receiver.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        FriendRequest friendRequest = new FriendRequest(sender, receiver.get(), friendRequestDto.getMessage(), new Date());
        friendRequestService.sendFriendRequest(friendRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/friendRequest/accept")
    public ResponseEntity<ErrorResponse> acceptFriendRequest(@RequestBody Long senderId, Authentication authentication) {
        Account receiver = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);
        if (receiver == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        System.out.println(senderId);
        System.out.println(receiver.getId());
        Optional<FriendRequest> fr = friendRequestService.getFriendRequestForReceiver(receiver, senderId);

        if (fr.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        friendRequestService.acceptFriendRequest(fr.get());
        return ResponseEntity.ok().build();
    }
}
