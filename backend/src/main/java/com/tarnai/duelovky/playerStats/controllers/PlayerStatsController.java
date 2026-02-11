package com.tarnai.duelovky.playerStats.controllers;

import com.tarnai.duelovky.mmr.entity.MmrId;
import com.tarnai.duelovky.playerStats.dto.PlayerStatsDto;
import com.tarnai.duelovky.playerStats.dto.PlayerStatsInputDto;
import com.tarnai.duelovky.playerStats.services.PlayerStatsService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Player;
import com.tarnai.duelovky.users.services.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PlayerStatsController {
    private final PlayerStatsService playerStatsService;
    private final UserService userService;


    public PlayerStatsController(PlayerStatsService playerStatsService, UserService userService) {
        this.playerStatsService = playerStatsService;
        this.userService = userService;
    }

    @Value("${mmr.secret}")
    private String secret;

    @GetMapping("/secured/playerStats/{gameId}")
    public PlayerStatsDto getPlayerStats(@PathVariable Long gameId, Authentication authentication) {
        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();
        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        Player player = account.get().getPlayer();
        if (player == null) {
            throw new IllegalArgumentException("Player not found for user with ID: " + account.get().getId());
        }

        MmrId mmrId = new MmrId(player.getId(), gameId);
        return playerStatsService.getPlayerStats(mmrId.getUser(), mmrId.getGame());
    }

    // This should be only called via Node.js socket server
    @PostMapping("/playerStats/update")
    public PlayerStatsDto updatePlayerStats(@RequestBody PlayerStatsInputDto playerStatsInputDto) {
        System.out.println(playerStatsInputDto.getMmrSecret());
        System.out.println(secret);

        if (!playerStatsInputDto.getMmrSecret().equals(secret)) {
            System.out.println(playerStatsInputDto.getMmrSecret());
            System.out.println(secret);
            throw new IllegalArgumentException("Invalid MMR secret provided.");
        }

        Optional<Account> user = userService.getUserById(playerStatsInputDto.getUserId());
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + playerStatsInputDto.getUserId());
        }
        Player player = user.get().getPlayer();
        if (player == null) {
            throw new IllegalArgumentException("Player not found for user with ID: " + playerStatsInputDto.getUserId());
        }

        return playerStatsService.setPlayerStats(playerStatsInputDto);
    }
}
