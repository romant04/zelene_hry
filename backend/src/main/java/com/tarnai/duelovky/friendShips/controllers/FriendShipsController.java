package com.tarnai.duelovky.friendShips.controllers;

import com.tarnai.duelovky.friendShips.dto.FriendShipDto;
import com.tarnai.duelovky.friendShips.services.FriendShipService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secured")
public class FriendShipsController {
    private final FriendShipService friendShipService;
    private final UserService userService;

    @Autowired
    public FriendShipsController(FriendShipService friendShipService, UserService userService) {
        this.friendShipService = friendShipService;
        this.userService = userService;
    }

    @GetMapping("/friendShips")
    public List<FriendShipDto> getAllFriendShips() {
        return friendShipService.getAllFriendShips().stream().map(FriendShipDto::new).toList();
    }

    @GetMapping("/user/friends")
    public List<FriendShipDto> getUsersFriends(Authentication authentication) {
        Account acc = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);

        if (acc == null) {
            return null;
        }

        return friendShipService.getUsersFriends(acc).stream().map(FriendShipDto::new).toList();
    }

    @DeleteMapping("/friendShip")
    public ResponseEntity<FriendShipDto> deleteFriendShip(@RequestBody Long friendId, Authentication authentication) {
        Account acc = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);
        Account friend = userService.getUserById(friendId).orElse(null);

        if (acc == null || friend == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        FriendShipDto f = friendShipService.deleteFriendShip(friend, acc);
        return ResponseEntity.ok(f);
    }
}
