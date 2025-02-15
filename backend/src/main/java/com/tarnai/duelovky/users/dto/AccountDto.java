package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Admin;
import com.tarnai.duelovky.users.entity.Player;

public class AccountDto {
    private Long id;
    private String username;
    private String email;

    private Player player;
    private Admin admin;

    public AccountDto(Account account) {
        this.id = account.getId();
        this.username = account.getUsername();
        this.email = account.getEmail();
        this.player = account.getPlayer();
        this.admin = account.getAdmin();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }
}
