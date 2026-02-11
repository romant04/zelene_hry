package com.tarnai.duelovky.users.controllers;

import com.tarnai.duelovky.users.dto.AccountDto;
import com.tarnai.duelovky.users.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/user")
    public AccountDto getUser(Authentication authentication) {
        return userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().map(AccountDto::new).orElse(null);
    }
}
