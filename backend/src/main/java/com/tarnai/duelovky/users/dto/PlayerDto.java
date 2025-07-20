package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.mmr.dto.MmrDto;
import com.tarnai.duelovky.mmr.entity.Mmr;
import com.tarnai.duelovky.users.entity.Player;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PlayerDto {
    private Long id;
    private Integer playTime;
    private AccountMinimumDto account;
    private List<MmrDto> mmr;

    public PlayerDto() {
    }

    public PlayerDto(Player player) {
        this.id = player.getId();
        this.playTime = player.getPlayTime();
        this.account = player.getAccount() != null ? new AccountMinimumDto(player.getAccount()) : null;
        this.mmr = player.getMmr() != null ? player.getMmr().stream()
                .map(m -> new MmrDto(m.getUser(), m.getGame(), m.getMmr()))
                .toList() : null;
    }
}
