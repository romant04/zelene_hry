package com.tarnai.duelovky.users.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "admins")
@NoArgsConstructor
@Getter
@Setter
public class Admin {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "permission_level")
    private Integer permissionLevel;

    public Admin(Integer permissionLevel) {
        this.permissionLevel = permissionLevel;
    }
}
