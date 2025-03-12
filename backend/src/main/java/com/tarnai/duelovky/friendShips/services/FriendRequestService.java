package com.tarnai.duelovky.friendShips.services;

import com.tarnai.duelovky.friendShips.dto.FriendShipDto;
import com.tarnai.duelovky.friendShips.entity.FriendRequest;
import com.tarnai.duelovky.friendShips.entity.Friendship;
import com.tarnai.duelovky.friendShips.repositories.FriendRequestRepository;
import com.tarnai.duelovky.friendShips.repositories.FriendShipRepository;
import com.tarnai.duelovky.users.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FriendRequestService {
    private final FriendRequestRepository friendRequestRepository;
    private final FriendShipRepository friendShipRepository;

    @Autowired
    public FriendRequestService(FriendRequestRepository friendRequestRepository, FriendShipRepository friendShipRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.friendShipRepository = friendShipRepository;
    }

    public void sendFriendRequest(FriendRequest friendRequest) {
        friendRequestRepository.save(friendRequest);
    }

    public List<FriendRequest> getAllFriendRequests() {
        return friendRequestRepository.findAll();
    }

    public Optional<FriendRequest> getFriendRequestForReceiver(Account receiver, Long senderId) {
        return friendRequestRepository.findForReceiver(receiver.getId(), senderId).stream().findFirst();
    }

    public List<FriendRequest> getUserFriendRequest(Account receiver) {
        return friendRequestRepository.findAllUserFriendRequests(receiver.getId());
    }

    public FriendShipDto acceptFriendRequest(FriendRequest friendRequest) {
        Friendship friendShip = new Friendship(friendRequest.getSender(), friendRequest.getReceiver(), new Date());
        Friendship f = friendShipRepository.save(friendShip);
        return new FriendShipDto(f);
    }

    public void deleteFriendRequest(FriendRequest friendRequest) {
        friendRequestRepository.delete(friendRequest);
    }
}
