package com.tarnai.duelovky.dms.controllers;

import com.tarnai.duelovky.dms.dto.DmDto;
import com.tarnai.duelovky.dms.dto.DmInputDto;
import com.tarnai.duelovky.dms.entity.DirectMessage;
import com.tarnai.duelovky.dms.services.DmService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secured/dms")
public class DmController {
    private final DmService dmService;
    private final UserService userService;

    @Autowired
    public DmController(DmService dmService, UserService userService) {
        this.dmService = dmService;
        this.userService = userService;
    }

    @GetMapping
    public List<DmDto> getUserDms(Authentication authentication, @RequestParam Long userId) {
        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();
        Optional<Account> user = userService.getUserById(userId);

        if (account.isEmpty() || user.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        return dmService.getUserDmsForFriend(account.get().getId(), userId);
    }

    @PostMapping
    public ResponseEntity<?> sendDm(Authentication authentication, @Valid @RequestBody DmInputDto DmInputDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();

        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        return ResponseEntity.ok(dmService.sendDm(DmInputDto, account.get()));
    }

    @DeleteMapping
    public void deleteDm(@RequestParam Long dmId, Authentication authentication) {
        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();
        DirectMessage dm = dmService.getDmById(dmId);

        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        if (!dm.getSender().getId().equals(account.get().getId())) {
            throw new IllegalArgumentException("You can only delete your own messages!");
        }

        dmService.deleteDm(dmId);
    }
}
