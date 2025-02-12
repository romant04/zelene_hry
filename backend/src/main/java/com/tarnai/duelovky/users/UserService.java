package com.tarnai.duelovky.users;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// TODO: Rewrite using database

@Service
public class UserService {
    private ArrayList<User> Users = new ArrayList<>() {
        {
            add(new User("admin", "admin@gmail.com", "password"));
            add(new User("user", "user@gmail.com", "password"));
        };
    };

    /// Function accepts name to filter out users, empty string can be passed to get all users
    public List<User> getUsersByName(String name) {
        return Users.stream().filter(user -> user.getUsername().contains(name)).toList();
    }

    public User createUser(String username, String email, String password) {
        User newUser = new User(username, email, password);
        Users.add(newUser);
        return newUser;
    }
}
