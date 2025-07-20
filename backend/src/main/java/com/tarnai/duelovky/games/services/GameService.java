package com.tarnai.duelovky.games.services;

import com.tarnai.duelovky.games.dto.GameCategoryDto;
import com.tarnai.duelovky.games.dto.GameDto;
import com.tarnai.duelovky.games.dto.GamePreviewDto;
import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.games.repositories.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// For now, we want just to read data from db no manipulation with anything game related
@Service
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<GamePreviewDto> getAllGames() {
        return gameRepository.findAll().stream()
                .map(game -> new GamePreviewDto(game.getGameId(), game.getName(), game.getPerex(),
                        game.getGameCategories().stream()
                                .map(GameCategoryDto::new)
                                .toList()))
                .toList();
    }

    public Game getGameById(Long gameId) {
        return gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found!"));
    }
}
