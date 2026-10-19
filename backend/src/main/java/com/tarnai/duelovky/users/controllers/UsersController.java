package com.tarnai.duelovky.users.controllers;

import com.tarnai.duelovky.users.dto.AccountDto;
import com.tarnai.duelovky.users.dto.AccountMinimumDto;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secured")
public class UsersController {
    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<AccountDto> getUsers(@RequestParam Optional<String> search) {
        return search.map(s -> userService.getUsersBySearchTerm(s).stream().map(AccountDto::new).toList()).orElseGet(() -> userService.getAllUsers().stream().map(AccountDto::new).toList());
    }

    @GetMapping("/users/search")
    public ResponseEntity<Page<AccountMinimumDto>> searchUsers(
            Authentication authentication,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Account currentUser = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);
        if (currentUser == null) {
            return ResponseEntity.badRequest().build();
        }

        int pageSize = Math.min(Math.max(size, 1), 50);
        int pageIndex = Math.max(page, 0);
        Page<AccountMinimumDto> results = userService
                .searchNonFriends(currentUser.getId(), q, PageRequest.of(pageIndex, pageSize, Sort.by("username").ascending()))
                .map(AccountMinimumDto::new);

        return ResponseEntity.ok(results);
    }

    @GetMapping("/user")
    public AccountDto getUser(Authentication authentication) {
        return userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().map(AccountDto::new).orElse(null);
    }
}
