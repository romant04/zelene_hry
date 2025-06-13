package com.tarnai.duelovky.chatGroups.controllers;

import com.tarnai.duelovky.chatGroups.dto.ChatDto;
import com.tarnai.duelovky.chatGroups.dto.ChatInputDto;
import com.tarnai.duelovky.chatGroups.dto.MessageDto;
import com.tarnai.duelovky.chatGroups.dto.MessageInputDto;
import com.tarnai.duelovky.chatGroups.entity.Chat;
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

    @Autowired
    public ChatController(ChatService chatService, UserService userService, MessageService messageService) {
        this.chatService = chatService;
        this.userService = userService;
        this.messageService = messageService;
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

    @PostMapping("/{chatId}/message")
    public MessageDto addMessageToChat(Authentication authentication, @PathVariable Long chatId, @Valid @RequestBody MessageInputDto messageInputDto) {
        System.out.println("Adding message to chat with ID: " + chatId);
        Optional<Account> account = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst();
        if (account.isEmpty()) {
            throw new IllegalArgumentException("User not found!");
        }

        return new MessageDto(messageService.addMessageToChat(messageInputDto, chatId, account.get()));
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
}


