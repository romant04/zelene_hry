package com.tarnai.duelovky.chatGroups.entity;

import lombok.Getter;

import java.io.Serializable;
import java.util.Date;

@Getter
public class ChatRestrictionId implements Serializable {
    private Long chatId;
    private Long userId;
    private Date startAt;

    public ChatRestrictionId() {}

    public ChatRestrictionId(Long chatId, Long userId, Date startAt) {
        this.chatId = chatId;
        this.userId = userId;
        this.startAt = startAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatRestrictionId that = (ChatRestrictionId) o;
        return chatId.equals(that.chatId) && userId.equals(that.userId) && startAt.equals(that.startAt);
    }

    @Override
    public int hashCode() {
        return chatId.hashCode() + userId.hashCode() + startAt.hashCode();
    }
}
