package com.tarnai.duelovky.friendShips.repositories;

import com.tarnai.duelovky.friendShips.entity.FriendShipId;
import com.tarnai.duelovky.friendShips.entity.Friendship;
import com.tarnai.duelovky.users.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendShipRepository extends JpaRepository<Friendship, FriendShipId> {
    @Query("SELECT f FROM Friendship f WHERE f.user1 = :user1 OR f.user2 = :user1")
    List<Friendship> getUsersFriends(@Param("user1") Account user1);

    @Query("SELECT f FROM Friendship f WHERE (f.user1 = :user1 AND f.user2 = :user2) OR (f.user1 = :user2 AND f.user2 = :user1)")
    List<Friendship> findByUser1AndUser2(Account user1, Account user2);
}
