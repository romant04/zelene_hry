package com.tarnai.duelovky.games.services;

import com.tarnai.duelovky.games.dto.GameCategoryDto;
import com.tarnai.duelovky.games.dto.GameDto;
import com.tarnai.duelovky.games.dto.GamePreviewDto;
import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.games.entity.GameTranslation;
import com.tarnai.duelovky.games.repositories.GameRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional(readOnly = true)
    public List<GamePreviewDto> getAllGames(String locale) {
        return gameRepository.findAll().stream()
                .map(game -> {
                    GameTranslation translation = game.resolveTranslation(locale);
                    String name = translation != null ? translation.getName() : game.getName();
                    String perex = translation != null ? translation.getPerex() : game.getPerex();

                    return new GamePreviewDto(
                            game.getGameId(),
                            game.getCode(),
                            name,
                            perex,
                            game.getGameCategories().stream()
                                    .map(category -> new GameCategoryDto(category, locale))
                                    .toList()
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public GameDto getGameDtoById(Long gameId, String locale) {
        return new GameDto(getGameById(gameId), locale);
    }

    @Transactional(readOnly = true)
    public Game getGameById(Long gameId) {
        return gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found!"));
    }
}

