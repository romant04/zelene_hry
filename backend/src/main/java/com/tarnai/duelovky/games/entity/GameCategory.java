package com.tarnai.duelovky.games.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
}
