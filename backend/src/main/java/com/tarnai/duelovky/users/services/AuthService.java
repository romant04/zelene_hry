package com.tarnai.duelovky.users.services;

import com.tarnai.duelovky.users.dto.LoginDto;
import com.tarnai.duelovky.users.dto.RegisterDto;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Player;
import com.tarnai.duelovky.users.repositories.AccountRepository;
import com.tarnai.duelovky.users.repositories.PlayerRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final PlayerRepository playerRepository;

    public AuthService(
            AccountRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            PlayerRepository playerRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.playerRepository = playerRepository;
    }

    public Account signup(RegisterDto input) {
        Player player = new Player(0);
        player = playerRepository.save(player);
        Account user = new Account(input.getUsername(), input.getEmail(), passwordEncoder.encode(input.getPassword()));
        user.setPlayer(player);

        return userRepository.save(user);
    }

    public Account authenticate(LoginDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userRepository.findBySearchTerm(input.getEmail()).stream().findFirst().orElse(null);
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).stream().findFirst().isPresent();
    }
    public boolean usernameExists(String username) {
        return userRepository.findByUsername(username).stream().findFirst().isPresent();
    }
}
