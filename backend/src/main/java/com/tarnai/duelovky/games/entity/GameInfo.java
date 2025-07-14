package com.tarnai.duelovky.games.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
}
