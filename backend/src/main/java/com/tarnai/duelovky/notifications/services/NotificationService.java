package com.tarnai.duelovky.notifications.services;

import com.tarnai.duelovky.notifications.dto.NotificationDto;
import com.tarnai.duelovky.notifications.dto.NotificationInputDto;
import com.tarnai.duelovky.notifications.entity.Notification;
import com.tarnai.duelovky.notifications.repositories.NotificationRepository;
import com.tarnai.duelovky.users.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public NotificationDto createNotification(NotificationInputDto notificationInputDto, Account user) {
        return new NotificationDto(notificationRepository.save(new Notification(user, notificationInputDto)));
    }

    public List<NotificationDto> getAllUserNotifications(Account user) {
        return notificationRepository.findAll().stream()
                .filter(n -> n.getUser().getId().equals(user.getId()) && !n.getIsRead())
                .map(NotificationDto::new)
                .toList();
    }

    public void acknowledgeNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found!"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    public void acknowledgeAllNotificationsForUser(Account user) {
        List<Notification> notifications = notificationRepository.findAll().stream()
                .filter(n -> n.getUser().getId().equals(user.getId()) && !n.getIsRead())
                .toList();

        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
}
