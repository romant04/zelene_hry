package com.tarnai.duelovky.notifications.controllers;

import com.tarnai.duelovky.notifications.dto.NotificationDto;
import com.tarnai.duelovky.notifications.dto.NotificationInputDto;
import com.tarnai.duelovky.notifications.services.NotificationService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    @Value("${mmr.secret}")
    private String secret;

    @Autowired
    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    public List<NotificationDto> getUserNotifications(Authentication authentication) {
        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();

        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        return notificationService.getAllUserNotifications(account.get());
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@Valid @RequestBody NotificationInputDto notificationInputDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        if (notificationInputDto.getMmrSecret() == null || !notificationInputDto.getMmrSecret().equals(secret)) {
            return ResponseEntity.status(403).body("Forbidden: Invalid MMR secret!");
        }

        Optional<Account> account = userService.getUserById(notificationInputDto.getUserId());
        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        return ResponseEntity.ok(notificationService.createNotification(notificationInputDto, account.get()));
    }

    @PutMapping
    public ResponseEntity<?> acknowledgeNotification(Authentication authentication, @RequestParam Long notificationId) {
        Optional<Account> user = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();

        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        if (notificationService.getAllUserNotifications(user.get()).stream().noneMatch(n -> n.getNotificationId().equals(notificationId))) {
            throw new IllegalArgumentException("Notification not found for this user!");
        }

        notificationService.acknowledgeNotification(notificationId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/ack-all")
    public void acknowledgeAllNotifications(Authentication authentication) {
        Optional<Account> user = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();

        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        notificationService.acknowledgeAllNotificationsForUser(user.get());
    }
}

