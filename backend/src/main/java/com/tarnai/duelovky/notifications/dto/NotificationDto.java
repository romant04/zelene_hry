package com.tarnai.duelovky.notifications.dto;

import com.tarnai.duelovky.notifications.entity.Notification;
import com.tarnai.duelovky.users.dto.AccountDto;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class NotificationDto {
    private Long notificationId;
    private String message;
    private String type;
    private Boolean isRead;
    private AccountDto user;
    private String redirectUrl;
    private Date createdAt;

    public NotificationDto(Notification notification) {
        this.notificationId = notification.getNotificationId();
        this.message = notification.getMessage();
        this.type = notification.getType();
        this.isRead = notification.getIsRead();
        this.user = new AccountDto(notification.getUser());
        this.redirectUrl = notification.getRedirectUrl();
        this.createdAt = notification.getCreatedAt();
    }
}
