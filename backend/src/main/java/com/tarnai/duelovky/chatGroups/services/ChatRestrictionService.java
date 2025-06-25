package com.tarnai.duelovky.chatGroups.services;

import com.tarnai.duelovky.chatGroups.dto.ChatRestrictionDto;
import com.tarnai.duelovky.chatGroups.dto.ChatRestrictionInputDto;
import com.tarnai.duelovky.chatGroups.entity.ChatRestriction;
import com.tarnai.duelovky.chatGroups.entity.ChatRestrictionId;
import com.tarnai.duelovky.chatGroups.repositories.ChatRestrictionRepository;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Admin;
import com.tarnai.duelovky.users.repositories.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ChatRestrictionService {
    private final ChatRestrictionRepository chatRestrictionRepository;
    private final AccountRepository accountRepository;

    public ChatRestrictionService(ChatRestrictionRepository chatRestrictionRepository, AccountRepository accountRepository) {
        this.chatRestrictionRepository = chatRestrictionRepository;
        this.accountRepository = accountRepository;
    }

    public ChatRestrictionDto createChatRestriction(ChatRestrictionInputDto chatRestrictionInputDto, Long adminUserId, Long chatId) {
        ChatRestriction chatRestriction = new ChatRestriction(chatRestrictionInputDto);

        Account admin = accountRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found with ID: " + adminUserId));

        Admin adminEntity = admin.getAdmin();
        if (adminEntity == null) {
            throw new IllegalArgumentException("User with ID: " + adminUserId + " is not an admin.");
        }
        adminEntity.setAccount(admin);

        chatRestriction.setAdmin(adminEntity);
        chatRestriction.setChatId(chatId);

        ChatRestriction savedChatRestriction = chatRestrictionRepository.save(chatRestriction);
        return new ChatRestrictionDto(savedChatRestriction);
    }

    public List<ChatRestrictionDto> getChatRestrictionsOfChat(Long chatId) {
        List<ChatRestriction> chatRestrictions = chatRestrictionRepository.findAllByChatId(chatId);
        if (chatRestrictions.isEmpty()) {
            return List.of();
        }

        return chatRestrictions.stream().map(cr -> {
            Optional<Account> adminAccount = accountRepository.findByAdminId(cr.getAdmin().getId()).stream().findFirst();

            if (adminAccount.isPresent()) {
                cr.getAdmin().setAccount(adminAccount.get());
            } else {
                cr.getAdmin().setAccount(null);
            }

            return new ChatRestrictionDto(cr);
        }).toList();
    }

    public void deleteChatRestriction(Long chatId, Long userId, Date startAt) {
        Optional<ChatRestriction> chatRestriction = chatRestrictionRepository.findChatRestriction(chatId, userId, startAt).stream().findFirst();

        if (chatRestriction.isEmpty()) {
            throw new IllegalArgumentException("Chat restriction not found for chat ID: " + chatId + ", user ID: " + userId + ", start time: " + startAt);
        }

        chatRestrictionRepository.delete(chatRestriction.get());
    }
}
