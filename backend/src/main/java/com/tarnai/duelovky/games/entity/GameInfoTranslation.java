package com.tarnai.duelovky.games.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "game_info_translations")
@IdClass(GameInfoTranslationId.class)
@Getter
@Setter
public class GameInfoTranslation {
    @Id
    @Column(name = "game_info_id")
    private Long gameInfoId;

    @Id
    @Column(name = "locale", length = 5)
    private String locale;

    @Column(name = "game_info", nullable = false, columnDefinition = "TEXT")
    private String gameInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_info_id", insertable = false, updatable = false)
    private GameInfo parent;
}
