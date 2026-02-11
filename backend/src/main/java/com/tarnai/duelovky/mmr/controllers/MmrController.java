package com.tarnai.duelovky.mmr.controllers;

import com.tarnai.duelovky.mmr.dto.MmrChangeDto;
import com.tarnai.duelovky.mmr.dto.MmrDto;
import com.tarnai.duelovky.mmr.dto.MmrInputDto;
import com.tarnai.duelovky.mmr.entity.MmrId;
import com.tarnai.duelovky.mmr.services.MmrService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Player;
import com.tarnai.duelovky.users.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MmrController {
    private final MmrService mmrService;
    private final UserService userService;

    public MmrController(MmrService mmrService, UserService userService) {
        this.mmrService = mmrService;
        this.userService = userService;
    }

    @Value("${mmr.secret}")
    private String secret;


    @GetMapping("/secured/mmr")
    public List<MmrDto> getAllMmr() {
        return mmrService.getAllMmrs();
    }

    @GetMapping("/secured/mmr/{gameId}")
    public MmrDto getMmr(@PathVariable Long gameId, Authentication authentication) {
        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();
        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        Player player = account.get().getPlayer();
        if (player == null) {
            throw new IllegalArgumentException("Player not found for user with ID: " + account.get().getId());
        }

        MmrId mmrId = new MmrId(player.getId(), gameId);
        return mmrService.getMmr(mmrId.getUser(), mmrId.getGame());
    }

    @PostMapping("/secured/mmr")
    public MmrDto createMmr(@Valid @RequestBody MmrInputDto mmrInputDto) {
        return mmrService.saveMmr(mmrInputDto);
    }

    @PostMapping("/mmr/update")
    public MmrDto updateMmr(@Valid @RequestBody MmrChangeDto mmrChangeDto) {
        if (!mmrChangeDto.getMmrSecret().equals(secret)) {
            System.out.println(mmrChangeDto.getMmrSecret());
            System.out.println(secret);
            throw new IllegalArgumentException("Invalid MMR secret provided.");
        }

        Optional<Account> user = userService.getUserById(mmrChangeDto.getUserId());
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + mmrChangeDto.getUserId());
        }
        Player player = user.get().getPlayer();
        if (player == null) {
            throw new IllegalArgumentException("Player not found for user with ID: " + mmrChangeDto.getUserId());
        }

        MmrId mmrId = new MmrId(player.getId(), mmrChangeDto.getGameId());
        MmrDto existingMmr = mmrService.getMmr(mmrId.getUser(), mmrId.getGame());
        if (existingMmr == null) {
            throw new IllegalArgumentException("MMR not found for user with ID: " + mmrChangeDto.getUserId() + " and game ID: " + mmrChangeDto.getGameId());
        }

        return mmrService.changeMmrValue(mmrId, mmrChangeDto.getMmr());
    }
}
