package com.tarnai.duelovky.games.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity(name = "games")
@Getter
@Setter
public class Game {
    @Id
    @Column(name = "game_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "perex")
    private String perex;

    @Column(name = "description")
    private String description;

    @OneToMany(
        mappedBy = "game",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @JsonManagedReference
    private List<GameInfo> gameInfo;

    @ManyToMany
    @JoinTable(
        name = "games_gamecategories",
        joinColumns = @JoinColumn(name = "game_id"),
        inverseJoinColumns = @JoinColumn(name = "game_category_id")
    )
    @JsonManagedReference
    private List<GameCategory> gameCategories;
}
