package com.tarnai.duelovky.chatGroups.entity;

import com.tarnai.duelovky.chatGroups.dto.ChatRestrictionDto;
import com.tarnai.duelovky.chatGroups.dto.ChatRestrictionInputDto;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.entity.Admin;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity(name = "chat_restrictions")
@IdClass(ChatRestrictionId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRestriction {
    @Id
    @Column(name = "chat_id")
    private Long chatId;

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "start_at")
    private Date startAt;

    @Column(name = "reason")
    private String reason;

    @Column(name = "end_date")
    private Date endDate;

    @ManyToOne
    @JoinColumn(name = "admin_user_id", referencedColumnName = "user_id")
    private Admin admin;


    public ChatRestriction(ChatRestrictionInputDto chatRestrictionInputDto) {
        this.userId = chatRestrictionInputDto.getUserId();
        this.reason = chatRestrictionInputDto.getReason();
        this.startAt = new Date();
        this.endDate = chatRestrictionInputDto.getEndDate();
    }
}
