package com.tarnai.duelovky.friendShips.dto;

import com.tarnai.duelovky.friendShips.entity.FriendRequest;

public class FriendRequestInputDto {
    private Long receiverId;
    private String message;

    public FriendRequestInputDto() {
    }

    public FriendRequestInputDto(Long receiverId, String message) {
        this.receiverId = receiverId;
        this.message = message;
    }

    public FriendRequestInputDto(FriendRequest friendRequest) {
        this.receiverId = friendRequest.getReceiver().getId();
        this.message = friendRequest.getMessage();
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
