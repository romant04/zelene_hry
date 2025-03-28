package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.users.entity.Account;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterResponse {
    private String token;
    private long expiresIn;
    private Account account;

    public RegisterResponse(String token, long expiresIn, Account account) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.account = account;
    }
}
