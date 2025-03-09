package com.tarnai.duelovky.dms.dto;

public class DmInputDto {
    private Long receiverId;
    private String message;

    public DmInputDto(Long senderId, Long receiverId, String message) {
        this.receiverId = receiverId;
        this.message = message;
    }

    public DmInputDto() {
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
