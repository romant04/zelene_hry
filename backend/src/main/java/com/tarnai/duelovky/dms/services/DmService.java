package com.tarnai.duelovky.dms.services;

import com.tarnai.duelovky.dms.dto.DmDto;
import com.tarnai.duelovky.dms.dto.DmInputDto;
import com.tarnai.duelovky.dms.entity.DirectMessage;
import com.tarnai.duelovky.dms.repositories.DmRepository;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class DmService {
    private final DmRepository dmRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public DmService(DmRepository dmRepository, AccountRepository accountRepository) {
        this.dmRepository = dmRepository;
        this.accountRepository = accountRepository;
    }

    public DirectMessage getDmById(Long dmId) {
        return dmRepository.findById(dmId).orElseThrow(() -> new IllegalArgumentException("DM not found!"));
    }

    public List<DmDto> getUserDmsForFriend(Long userId, Long userId2) {
        return dmRepository.getUserDms(userId, userId2).stream().map(DmDto::new).toList();
    }

    public DmDto sendDm(DmInputDto dmInputDto, Account sender) {
        Optional<Account> receiver = accountRepository.findById(dmInputDto.getReceiverId());

        if (receiver.isEmpty()) {
            throw new IllegalArgumentException("Sender or receiver not found!");
        }

        DirectMessage directMessage = new DirectMessage(
                sender,
                receiver.get(),
                dmInputDto.getMessage(),
                new Date()
        );
        dmRepository.save(directMessage);
        return new DmDto(directMessage);
    }

    public void deleteDm(Long dmId) {
        dmRepository.deleteById(dmId);
    }
}
