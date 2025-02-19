package com.tarnai.duelovky.users.entity;

import jakarta.persistence.*;

@Entity(name = "admins")
public class Admin {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1 to 3
    @Column(name = "permission_level")
    private Integer permissionLevel;

    public Admin(Integer permissionLevel) {
        this.permissionLevel = permissionLevel;
    }

    public Admin() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPermissionLevel() {
        return permissionLevel;
    }

    public void setPermissionLevel(Integer permissionLevel) {
        this.permissionLevel = permissionLevel;
    }
}
