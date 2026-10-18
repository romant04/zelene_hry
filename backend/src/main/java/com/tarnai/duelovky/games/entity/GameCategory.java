package com.tarnai.duelovky.games.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tarnai.duelovky.i18n.LocaleUtils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity(name = "game_categories")
@Getter
@Setter
public class GameCategory {
    @Id
    @Column(name = "game_category_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameCategoryId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToMany(
        mappedBy = "gameCategories",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @JsonManagedReference
    private List<Game> games;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<GameCategoryTranslation> translations;

    public String resolveName(String locale) {
        if (translations == null || translations.isEmpty()) {
            return name;
        }

        return translations.stream()
                .filter(t -> locale.equals(t.getLocale()))
                .map(GameCategoryTranslation::getName)
                .findFirst()
                .or(() -> translations.stream()
                        .filter(t -> LocaleUtils.DEFAULT_LOCALE.equals(t.getLocale()))
                        .map(GameCategoryTranslation::getName)
                        .findFirst())
                .orElse(name);
    }
}
