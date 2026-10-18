package com.tarnai.duelovky.games.entity;

import com.tarnai.duelovky.i18n.LocaleUtils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity(name = "game_info")
@Getter
@Setter
public class GameInfo {
    @Id
    @Column(name = "game_info_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameInfoId;

    @Column(name = "game_info", nullable = false)
    private String gameInfo;

    @Column(name = "info_label", nullable = false)
    @Enumerated(EnumType.STRING)
    private GameInfoType infoLabel;

    @ManyToOne
    @JoinColumn(name = "game_id", referencedColumnName = "game_id")
    private Game game;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private List<GameInfoTranslation> translations;

    public String resolveText(String locale) {
        if (translations == null || translations.isEmpty()) {
            return gameInfo;
        }

        return translations.stream()
                .filter(t -> locale.equals(t.getLocale()))
                .map(GameInfoTranslation::getGameInfo)
                .findFirst()
                .or(() -> translations.stream()
                        .filter(t -> LocaleUtils.DEFAULT_LOCALE.equals(t.getLocale()))
                        .map(GameInfoTranslation::getGameInfo)
                        .findFirst())
                .orElse(gameInfo);
    }
}
