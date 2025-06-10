package com.tarnai.duelovky.chatGroups.controllers;

import com.tarnai.duelovky.chatGroups.dto.ChatDto;
import com.tarnai.duelovky.chatGroups.dto.ChatInputDto;
import com.tarnai.duelovky.chatGroups.entity.Chat;
import com.tarnai.duelovky.chatGroups.services.ChatService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secured/chats")
public class ChatController {
    private final ChatService chatService;
    private final UserService userService;

    @Autowired
    public ChatController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    @PostMapping
    public void createChat(@Valid ChatInputDto chatInputDto) {
        chatService.createChat(chatInputDto);
    }

    @PostMapping("/addUser")
    public void addUserToChat(@RequestParam Long chatId, @RequestParam Long userId) {
        Optional<Account> account = userService.getUserById(userId);

        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        chatService.addUserToChat(chatId, account.get());
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
}


