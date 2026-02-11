package com.tarnai.duelovky.users.dto;

import com.tarnai.duelovky.mmr.dto.MmrDto;
import com.tarnai.duelovky.playerStats.dto.PlayerStatsDto;
import com.tarnai.duelovky.users.entity.Player;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PlayerDto {
    private Long id;
    private AccountMinimumDto account;
    private List<MmrDto> mmr;
    private List<PlayerStatsDto> playerStats;

    public PlayerDto(Player player) {
        this.id = player.getId();
        this.account = player.getAccount() != null ? new AccountMinimumDto(player.getAccount()) : null;
        this.mmr = player.getMmr() != null ? player.getMmr().stream()
                .map(m -> new MmrDto(m.getUser(), m.getGame(), m.getMmr()))
                .toList() : null;
        this.playerStats = player.getPlayerStats() != null ? player.getPlayerStats().stream()
                .map(x -> new PlayerStatsDto(x.getUser(), x.getGame(), x.getGamesPlayed(), x.getWinRatio(), x.getPlayTimeMinutes()))
                .toList() : null;
    }
}
