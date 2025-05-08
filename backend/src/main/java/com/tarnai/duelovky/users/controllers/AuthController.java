package com.tarnai.duelovky.users.controllers;

import com.tarnai.duelovky.users.dto.LoginDto;
import com.tarnai.duelovky.users.dto.LoginResponse;
import com.tarnai.duelovky.users.dto.RegisterDto;
import com.tarnai.duelovky.users.dto.RegisterResponse;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.AuthService;
import com.tarnai.duelovky.users.services.JwtService;
import com.tarnai.duelovky.validators.ValidPassword;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final JwtService jwtService;
    private final AuthService AuthService;

    public AuthController(JwtService jwtService, AuthService AuthService) {
        this.jwtService = jwtService;
        this.AuthService = AuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto registerUserDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        // Find out if the email or username already exists
        if (AuthService.emailExists(registerUserDto.getEmail()) || AuthService.usernameExists(registerUserDto.getUsername())) {
            return ResponseEntity.badRequest().body("Uživatel s tímto emailem nebo uživatelským jménem již existuje");
        }
        Account registeredUser = AuthService.signup(registerUserDto);

        String jwtToken = jwtService.generateToken(registeredUser);

        RegisterResponse registerResponse = new RegisterResponse(jwtToken, jwtService.getExpirationTime(), registeredUser);
        return ResponseEntity.ok(registerResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody LoginDto loginUserDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }

        Account authenticatedUser = AuthService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }
}
