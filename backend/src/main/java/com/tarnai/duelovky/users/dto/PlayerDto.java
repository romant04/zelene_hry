package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.users.entity.Player;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerDto {
    private Long id;
    private Integer playTime;
    private AccountMinimumDto account;

    public PlayerDto() {
    }

    public PlayerDto(Player player) {
        this.id = player.getId();
        this.playTime = player.getPlayTime();
        this.account = player.getAccount() != null ? new AccountMinimumDto(player.getAccount()) : null;
    }
}
