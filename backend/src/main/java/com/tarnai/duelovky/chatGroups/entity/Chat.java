package com.tarnai.duelovky.chatGroups.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.tarnai.duelovky.chatGroups.dto.ChatInputDto;
import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity(name = "chats")
@Getter
@Setter
public class Chat {
    @Id
    @Column(name = "chat_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "public", nullable = false)
    private boolean isPublic = false;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Message> messages;

    @ManyToMany
    @JoinTable(
        name = "users_chats",
        joinColumns = @JoinColumn(name = "chat_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonManagedReference
    Set<Account> users;

    public Chat() {

    }

    public Chat(ChatInputDto chatInputDto) {
        this.name = chatInputDto.getName();
        this.isPublic = chatInputDto.isPublic();
    }
}
