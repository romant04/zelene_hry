package com.tarnai.duelovky.chatGroups.repositories;

import com.tarnai.duelovky.chatGroups.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Additional query methods can be defined here if needed
}
