package com.tarnai.duelovky.mmr.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaderboardEntryDto {
    private String username;
    private Integer mmr;

    public LeaderboardEntryDto(String username, Integer mmr) {
        this.username = username;
        this.mmr = mmr != null ? mmr : 0;
    }

    public LeaderboardEntryDto(String username, Long mmr) {
        this.username = username;
        this.mmr = mmr != null ? mmr.intValue() : 0;
    }
}
