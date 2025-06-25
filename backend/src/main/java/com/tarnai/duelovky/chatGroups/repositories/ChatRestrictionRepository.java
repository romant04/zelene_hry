package com.tarnai.duelovky.chatGroups.repositories;

import com.tarnai.duelovky.chatGroups.entity.ChatRestriction;
import com.tarnai.duelovky.chatGroups.entity.ChatRestrictionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRestrictionRepository extends JpaRepository<ChatRestriction, ChatRestrictionId> {
    /**
     * Finds all chat restrictions for a given chat.
     *
     * @param chatId the chatId for which to find restrictions
     * @return a list of chat restrictions associated with the specified chat
     */
    List<ChatRestriction> findAllByChatId(Long chatId);

    @Query("SELECT cr FROM chat_restrictions cr WHERE cr.chatId = :chatId AND cr.userId = :userId AND cr.startAt <= :startAt")
    List<ChatRestriction> findChatRestriction(@Param("chatId") Long chatId,
                                              @Param("userId") Long userId,
                                              @Param("startAt") java.util.Date startAt);
}
