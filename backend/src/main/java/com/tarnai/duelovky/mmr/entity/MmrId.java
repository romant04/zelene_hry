package com.tarnai.duelovky.mmr.entity;

import lombok.Getter;

import java.io.Serializable;

@Getter
public class MmrId implements Serializable {
    private Long user;
    private Long game;

    public MmrId() {}

    public MmrId(Long userId, long gameId) {
        this.user = userId;
        this.game = gameId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MmrId mmrId = (MmrId) o;
        return user.equals(mmrId.user) && game.equals(mmrId.game);
    }

    @Override
    public int hashCode() {
        return user.hashCode() + Long.hashCode(game);
    }
}
