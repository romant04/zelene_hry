package com.tarnai.duelovky.friendShips.controllers;

import com.tarnai.duelovky.friendShips.dto.FriendRequestDto;
import com.tarnai.duelovky.friendShips.dto.FriendRequestInputDto;
import com.tarnai.duelovky.friendShips.dto.FriendShipDto;
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
    public List<FriendRequestInputDto> getAllFriendRequests() {
        return friendRequestService.getAllFriendRequests().stream().map(FriendRequestInputDto::new).toList();
    }


    @GetMapping("user/friendRequests")
    public List<FriendRequestDto> getUserFriendRequest(Authentication authentication) {
        Account acc = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);

        if (acc == null) {
            return null;
        }

        return friendRequestService.getUserFriendRequest(acc).stream().map(FriendRequestDto::new).toList();
    }


    @PostMapping("/friendRequest")
    public ResponseEntity<ErrorResponse> sendFriendRequest(@RequestBody FriendRequestInputDto friendRequestInputDto, Authentication authentication) {
        Account sender = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);
        Optional<Account> receiver = userService.getUserById(friendRequestInputDto.getReceiverId());

        if (sender == null || receiver.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        FriendRequest friendRequest = new FriendRequest(sender, receiver.get(), friendRequestInputDto.getMessage(), new Date());
        friendRequestService.sendFriendRequest(friendRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/friendRequest/accept")
    public ResponseEntity<FriendShipDto> acceptFriendRequest(@RequestBody Long senderId, Authentication authentication) {
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

        FriendShipDto newFriendship = friendRequestService.acceptFriendRequest(fr.get());
        return ResponseEntity.ok(newFriendship);
    }

    @DeleteMapping("/friendRequest")
    public ResponseEntity<ErrorResponse> deleteFriendRequest(@RequestBody Long senderId, Authentication authentication) {
        Account receiver = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);
        if (receiver == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<FriendRequest> fr = friendRequestService.getFriendRequestForReceiver(receiver, senderId);

        if (fr.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        friendRequestService.deleteFriendRequest(fr.get());
        return ResponseEntity.ok().build();
    }
}
