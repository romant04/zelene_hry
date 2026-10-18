package com.tarnai.duelovky.games.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "game_translations")
@IdClass(GameTranslationId.class)
@Getter
@Setter
public class GameTranslation {
    @Id
    @Column(name = "game_id")
    private Long gameId;

    @Id
    @Column(name = "locale", length = 5)
    private String locale;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "perex")
    private String perex;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", insertable = false, updatable = false)
    private Game game;
}
