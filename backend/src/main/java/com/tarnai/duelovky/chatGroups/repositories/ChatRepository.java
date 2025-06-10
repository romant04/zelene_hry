package com.tarnai.duelovky.chatGroups.repositories;

import com.tarnai.duelovky.chatGroups.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
}
