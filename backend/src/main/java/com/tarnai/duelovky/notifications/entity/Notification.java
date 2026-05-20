package com.tarnai.duelovky.notifications.entity;

import com.tarnai.duelovky.notifications.dto.NotificationInputDto;
import com.tarnai.duelovky.users.entity.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {
    @Id
    @Column(name = "notification_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Account user;

    @Column(name = "redirect_url")
    private String redirectUrl;

    @Column(name = "created_at")
    private Date createdAt;

    public Notification(Account user, NotificationInputDto inputDto) {
        this.user = user;
        this.type = inputDto.getType();
        this.message = inputDto.getMessage();
        this.isRead = false;
        this.redirectUrl = inputDto.getRedirectUrl();
        this.createdAt = new Date();
    }
}
