package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Admin;
import com.tarnai.duelovky.users.entity.Player;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
}
