package com.tarnai.duelovky.chatGroups.services;

import com.tarnai.duelovky.chatGroups.dto.MessageInputDto;
import com.tarnai.duelovky.chatGroups.entity.Chat;
import com.tarnai.duelovky.chatGroups.entity.Message;
import com.tarnai.duelovky.chatGroups.repositories.ChatRepository;
import com.tarnai.duelovky.chatGroups.repositories.MessageRepository;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.repositories.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final AccountRepository accountRepository;

    public MessageService(MessageRepository messageRepository, ChatRepository chatRepository, AccountRepository accountRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
        this.accountRepository = accountRepository;
    }

    public Message addMessageToChat(MessageInputDto message, Long chatId, Account sender) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found!"));

        Message newMessage = new Message(message.getMessage(), sender, chat, new Date());
        chat.getMessages().add(newMessage);
        messageRepository.save(newMessage);

        return newMessage;
    }
}
