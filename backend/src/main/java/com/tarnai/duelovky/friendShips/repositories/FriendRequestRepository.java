package com.tarnai.duelovky.friendShips.repositories;

import com.tarnai.duelovky.friendShips.entity.FriendRequest;
import com.tarnai.duelovky.friendShips.entity.FriendRequestId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, FriendRequestId> {
    @Query("SELECT fr FROM FriendRequest fr WHERE fr.receiver.id = :receiverId AND fr.sender.id = :senderId")
    List<FriendRequest> findForReceiver(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);

    @Query("SELECT fr FROM FriendRequest fr WHERE fr.receiver.id = :receiverId")
    List<FriendRequest> findAllUserFriendRequests(@Param("receiverId") Long receiverId);
}
