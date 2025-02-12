package com.tarnai.duelovky.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UsersController {
    private UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers(@RequestParam Optional<String> search) {
        return userService.getUsersByName(search.orElse(""));
    }

    // TODO: Handle auth correctly
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.createUser(user.getUsername(), user.getEmail(), user.getPassword());
    }
}
