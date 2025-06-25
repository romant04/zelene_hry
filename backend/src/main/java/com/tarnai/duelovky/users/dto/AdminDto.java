package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.users.entity.Admin;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDto {
    private Long id;
    private Integer permissionLevel;
    private AccountMinimumDto account;

    public AdminDto() {}

    public AdminDto(Admin admin) {
        this.id = admin.getId();
        this.permissionLevel = admin.getPermissionLevel();
        this.account = admin.getAccount() != null ? new AccountMinimumDto(admin.getAccount()) : null;
    }
}
