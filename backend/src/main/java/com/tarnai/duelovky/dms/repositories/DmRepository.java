package com.tarnai.duelovky.dms.repositories;

import com.tarnai.duelovky.dms.entity.DirectMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DmRepository extends JpaRepository<DirectMessage, Long> {
    @Query("SELECT dm FROM direct_messages dm WHERE (dm.sender.id = :userId AND dm.receiver.id = :userId2) OR (dm.sender.id = :userId2 AND dm.receiver.id = :userId) ORDER BY dm.createdAt")
    List<DirectMessage> getUserDms(@Param("userId") Long userId, @Param("userId2") Long userId2);
}
