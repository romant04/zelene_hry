package com.tarnai.duelovky.chatGroups.services;

import com.tarnai.duelovky.chatGroups.dto.ChatInputDto;
import com.tarnai.duelovky.chatGroups.entity.Chat;
import com.tarnai.duelovky.chatGroups.entity.Message;
import com.tarnai.duelovky.chatGroups.repositories.ChatRepository;
import com.tarnai.duelovky.users.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    private final ChatRepository chatRepository;

    @Autowired
    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public void createChat(ChatInputDto chatInputDto) {
        if (chatInputDto.getName() == null || chatInputDto.getName().isEmpty()) {
            throw new IllegalArgumentException("Chat name cannot be empty!");
        }

        Chat chat = new Chat(chatInputDto);
        chatRepository.save(chat);
    }

    public Chat getChatById(Long chatId) {
        return chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found!"));
    }

    public List<Chat> getAllChats() {
        return chatRepository.findAll();
    }

    public void addUserToChat(Long chatId, Account user) {
        Chat chat = getChatById(chatId);
        chat.getUsers().add(user);
        chatRepository.save(chat);
    }
}
