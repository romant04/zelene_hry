package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.users.entity.Account;

public class RegisterResponse {
    private String token;
    private long expiresIn;
    private Account account;

    public RegisterResponse(String token, long expiresIn, Account account) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.account = account;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }
}
