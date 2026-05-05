package com.tarnai.duelovky.playerStats.services;

import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.games.services.GameService;
import com.tarnai.duelovky.mmr.entity.MmrId;
import com.tarnai.duelovky.playerStats.dto.PlayerStatsDto;
import com.tarnai.duelovky.playerStats.dto.PlayerStatsInputDto;
import com.tarnai.duelovky.playerStats.entity.PlayerStats;
import com.tarnai.duelovky.playerStats.repositories.PlayerStatsRepository;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Player;
import com.tarnai.duelovky.users.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlayerStatsService {
    private final PlayerStatsRepository playerStatsRepository;
    private final UserService userService;
    private final GameService gameService;

    private static final Logger log = LoggerFactory.getLogger(PlayerStatsService.class);

    public PlayerStatsService(PlayerStatsRepository playerStatsRepository, UserService userService, GameService gameService) {
        this.playerStatsRepository = playerStatsRepository;
        this.userService = userService;
        this.gameService = gameService;
    }

    public PlayerStatsDto getPlayerStats(Long userId, Long gameId) {
        return playerStatsRepository.findById(new MmrId(userId, gameId)).stream().findFirst()
                .map(x -> new PlayerStatsDto(x.getUser(), x.getGame(), x.getGamesPlayed(), x.getWinRatio(), x.getPlayTimeMinutes()))
                .orElse(null);
    }

    public PlayerStatsDto setPlayerStats(PlayerStatsInputDto playerStatsInputDto) {
        log.info("Setting player stats for userId={}, gameId={}",
                playerStatsInputDto.getUserId(),
                playerStatsInputDto.getGameId());

        Optional<Account> user = userService.getUserById(playerStatsInputDto.getUserId());

        if (user.isEmpty()) {
            log.warn("User not found with ID={}", playerStatsInputDto.getUserId());
            throw new IllegalArgumentException("User not found with ID: " + playerStatsInputDto.getUserId());
        }

        Player player = user.get().getPlayer();
        if (player == null) {
            log.warn("Player not found for userId={}", playerStatsInputDto.getUserId());
            throw new IllegalArgumentException("Player not found for user with ID: " + playerStatsInputDto.getUserId());
        }

        Game game = gameService.getGameById(playerStatsInputDto.getGameId());
        if (game == null) {
            log.warn("Game not found with ID={}", playerStatsInputDto.getGameId());
            throw new IllegalArgumentException("Game not found with ID: " + playerStatsInputDto.getGameId());
        }

        PlayerStats playerStats = new PlayerStats(player, game, playerStatsInputDto.getGamesPlayed(), playerStatsInputDto.getPlayTimeMinutes(), playerStatsInputDto.getWinRatio());
        PlayerStats savedPlayerStats = playerStatsRepository.save(playerStats);

        log.info("Player stats saved successfully: userId={}, gameId={}",
                player.getId(),
                game.getGameId());

        return new PlayerStatsDto(savedPlayerStats.getUser(), savedPlayerStats.getGame(), savedPlayerStats.getGamesPlayed(), savedPlayerStats.getWinRatio(), savedPlayerStats.getPlayTimeMinutes());
    }
}
