package com.tarnai.duelovky.games.dto;

import com.tarnai.duelovky.games.entity.GameInfo;
import com.tarnai.duelovky.games.entity.GameInfoType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameInfoDto {
    private Long gameInfoId;
    private String gameInfo;
    private GameInfoType infoLabel;

    public GameInfoDto(GameInfo gameInfo) {
        this.gameInfoId = gameInfo.getGameInfoId();
        this.gameInfo = gameInfo.getGameInfo();
        this.infoLabel = gameInfo.getInfoLabel();
    }
}
