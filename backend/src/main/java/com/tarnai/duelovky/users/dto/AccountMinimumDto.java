package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.users.entity.Account;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountMinimumDto {
    private Long id;
    private String username;

    public AccountMinimumDto() {
    }

    public AccountMinimumDto(Long id, String username) {
        this.id = id;
        this.username = username;
    }

    public AccountMinimumDto(Account account) {
        if (account != null) {
            this.id = account.getId();
            this.username = account.getUsername();
        } else {
            this.id = null;
            this.username = null;
        }
    }
}
