package com.tarnai.duelovky.friendShips.services;

import com.tarnai.duelovky.friendShips.dto.FriendShipDto;
import com.tarnai.duelovky.friendShips.entity.Friendship;
import com.tarnai.duelovky.friendShips.repositories.FriendShipRepository;
import com.tarnai.duelovky.users.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendShipService {
    private final FriendShipRepository friendShipRepository;

    @Autowired
    public FriendShipService(FriendShipRepository friendShipRepository) {
        this.friendShipRepository = friendShipRepository;
    }

    public List<Friendship> getAllFriendShips() {
        return friendShipRepository.findAll();
    }

    public List<Friendship> getUsersFriends(Account account) {
        return friendShipRepository.getUsersFriends(account);
    }

    public FriendShipDto deleteFriendShip(Account user1, Account user2) {
        Friendship friendShip = friendShipRepository.findByUser1AndUser2(user1, user2).stream().findFirst().orElse(null);

        if (friendShip == null) {
            throw new IllegalArgumentException("Friendship not found!");
        }

        friendShipRepository.delete(friendShip);
        return new FriendShipDto(friendShip);
    }
}
