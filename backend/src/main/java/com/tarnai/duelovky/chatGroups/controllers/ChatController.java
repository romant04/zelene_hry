package com.tarnai.duelovky.chatGroups.controllers;

import com.tarnai.duelovky.chatGroups.dto.*;
import com.tarnai.duelovky.chatGroups.entity.Chat;
import com.tarnai.duelovky.chatGroups.entity.ChatRestrictionId;
import com.tarnai.duelovky.chatGroups.services.ChatRestrictionService;
import com.tarnai.duelovky.chatGroups.services.ChatService;
import com.tarnai.duelovky.chatGroups.services.MessageService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secured/chats")
public class ChatController {
    private final ChatService chatService;
    private final UserService userService;
    private final MessageService messageService;
    private final ChatRestrictionService chatRestrictionService;

    @Autowired
    public ChatController(ChatService chatService, UserService userService, MessageService messageService, ChatRestrictionService chatRestrictionService) {
        this.chatService = chatService;
        this.userService = userService;
        this.messageService = messageService;
        this.chatRestrictionService = chatRestrictionService;
    }

    @PostMapping
    public void createChat(@Valid ChatInputDto chatInputDto) {
        chatService.createChat(chatInputDto);
    }

    @PostMapping("/{chatId}/addUser")
    public ChatDto addUserToChat(@PathVariable Long chatId, @RequestBody Long userId) {
        Optional<Account> account = userService.getUserById(userId);

        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        return chatService.addUserToChat(chatId, account.get());
    }

    @PostMapping("/{chatId}/message")
    public MessageDto addMessageToChat(Authentication authentication, @PathVariable Long chatId, @Valid @RequestBody MessageInputDto messageInputDto) {
        System.out.println("Adding message to chat with ID: " + chatId);
        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();
        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        return new MessageDto(messageService.addMessageToChat(messageInputDto, chatId, account.get()));
    }

    @PostMapping("/{chatId}/restrictUser")
    public ChatRestrictionDto restrictUserInChat(@PathVariable Long chatId, @Valid @RequestBody ChatRestrictionInputDto chatRestrictionInputDto, Authentication authentication) {
        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();
        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        Chat chat = chatService.getChatById(chatId);
        if (chat == null) {
            throw new IllegalArgumentException("Chat not found with ID: " + chatId);
        }

        return chatRestrictionService.createChatRestriction(chatRestrictionInputDto, account.get().getId(), chatId);
    }


    @GetMapping("/{chatId}/restrictions")
    public List<ChatRestrictionDto> getChatRestrictions(@PathVariable Long chatId) {
        return chatRestrictionService.getChatRestrictionsOfChat(chatId);
    }

    @GetMapping
    public List<ChatDto> getAllChats() {
        return chatService.getAllChats().stream()
                .map(ChatDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    public ChatDto getChatById(@PathVariable Long id) {
        return new ChatDto(chatService.getChatById(id));
    }

    @GetMapping("/{id}/messages")
    public List<MessageDto> getMessagesByChatId(@PathVariable Long id) {
        Chat chat = chatService.getChatById(id);
        return chat.getMessages().stream()
                .map(MessageDto::new)
                .toList();
    }

    @DeleteMapping("/restrictions")
    public void deleteChatRestriction(@RequestBody ChatRestrictionId chatRestrictionId) {
        chatRestrictionService.deleteChatRestriction(chatRestrictionId.getChatId(), chatRestrictionId.getUserId(), chatRestrictionId.getStartAt());
    }
}


