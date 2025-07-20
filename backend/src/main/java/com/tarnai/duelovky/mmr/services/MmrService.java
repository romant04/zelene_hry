package com.tarnai.duelovky.mmr.services;

import com.tarnai.duelovky.games.dto.GameDto;
import com.tarnai.duelovky.games.entity.Game;
import com.tarnai.duelovky.games.services.GameService;
import com.tarnai.duelovky.mmr.dto.MmrDto;
import com.tarnai.duelovky.mmr.dto.MmrInputDto;
import com.tarnai.duelovky.mmr.entity.Mmr;
import com.tarnai.duelovky.mmr.entity.MmrId;
import com.tarnai.duelovky.mmr.repositories.MmrRepository;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Player;
import com.tarnai.duelovky.users.services.UserService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MmrService {
    private final MmrRepository mmrRepository;
    private final UserService userService;
    private final GameService gameService;

    public MmrService(MmrRepository mmrRepository, UserService userService, GameService gameService) {
        this.mmrRepository = mmrRepository;
        this.userService = userService;
        this.gameService = gameService;
    }

    public MmrDto getMmr(Long userId, Long gameId) {
        return mmrRepository.findById(new MmrId(userId, gameId))
                .map(mmr -> new MmrDto(mmr.getUser(), mmr.getGame(), mmr.getMmr()))
                .orElse(null);
    }

    public List<MmrDto> getAllMmrs() {
        return mmrRepository.findAll().stream()
                .map(mmr -> new MmrDto(mmr.getUser(), mmr.getGame(), mmr.getMmr()))
                .toList();
    }

    public MmrDto saveMmr(MmrInputDto mmrInputDto) {
        Optional<Account> user = userService.getUserById(mmrInputDto.getUserId());

        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + mmrInputDto.getUserId());
        }

        Player player = user.get().getPlayer();
        if (player == null) {
            throw new IllegalArgumentException("Player not found for user with ID: " + mmrInputDto.getUserId());
        }

        Game game = gameService.getGameById(mmrInputDto.getGameId());
        if (game == null) {
            throw new IllegalArgumentException("Game not found with ID: " + mmrInputDto.getGameId());
        }

        Mmr mmr = new Mmr(player, game, 200);
        Mmr savedMmr = mmrRepository.save(mmr);
        return new MmrDto(savedMmr.getUser(), savedMmr.getGame(), savedMmr.getMmr());
    }

    public MmrDto changeMmrValue(MmrId mmrId, Integer newMmrValue) {
        Mmr mmr = mmrRepository.findById(mmrId)
                .orElseThrow(() -> new IllegalArgumentException("MMR not found for user ID: " + mmrId.getUser() + " and game ID: " + mmrId.getGame()));

        mmr.setMmr(newMmrValue);
        Mmr updatedMmr = mmrRepository.save(mmr);
        return new MmrDto(updatedMmr.getUser(), updatedMmr.getGame(), updatedMmr.getMmr());
    }
}
