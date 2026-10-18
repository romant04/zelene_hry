package com.tarnai.duelovky.games.controllers;

import com.tarnai.duelovky.games.dto.GameDto;
import com.tarnai.duelovky.games.dto.GamePreviewDto;
import com.tarnai.duelovky.games.services.GameService;
import com.tarnai.duelovky.i18n.LocaleUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/games") // Games API endpoint doesn't require authentication
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public List<GamePreviewDto> getAllGames(
            @RequestHeader(value = "Accept-Language", defaultValue = "cs") String acceptLanguage
    ) {
        return gameService.getAllGames(LocaleUtils.resolve(acceptLanguage));
    }

    @GetMapping("/{gameId}")
    public GameDto getGameById(
            @PathVariable Long gameId,
            @RequestHeader(value = "Accept-Language", defaultValue = "cs") String acceptLanguage
    ) {
        return gameService.getGameDtoById(gameId, LocaleUtils.resolve(acceptLanguage));
    }
}

