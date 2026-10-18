package com.tarnai.duelovky.games.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "game_category_translations")
@IdClass(GameCategoryTranslationId.class)
@Getter
@Setter
public class GameCategoryTranslation {
    @Id
    @Column(name = "game_category_id")
    private Long gameCategoryId;

    @Id
    @Column(name = "locale", length = 5)
    private String locale;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_category_id", insertable = false, updatable = false)
    private GameCategory category;
}
