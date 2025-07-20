package com.tarnai.duelovky.mmr.dto;

import com.tarnai.duelovky.games.dto.GameDto;
import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.mmr.entity.Mmr;
import com.tarnai.duelovky.users.dto.PlayerDto;
import com.tarnai.duelovky.users.entity.Player;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MmrDto {
    private Long userId;
    private Long gameId;
    private Integer mmr;

    public MmrDto(Player user, Game game, Integer mmr) {
        this.userId = user.getId();
        this.gameId = game.getGameId();
        this.mmr = mmr;
    }
}
