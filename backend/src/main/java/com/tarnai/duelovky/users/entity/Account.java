package com.tarnai.duelovky.users.entity;


import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity(name = "accounts")
public class Account implements UserDetails {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;

    @OneToOne()
    @JoinColumn(name = "player_user_id", referencedColumnName = "user_id", nullable = true)
    private Player player;
    @OneToOne()
    @JoinColumn(name = "admin_user_id", referencedColumnName = "user_id", nullable = true)
    private Admin admin;

    public Account(String username, String email, String password, Player player) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.player = player;
    }

    public Account(String username, String email, String password, Admin admin) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.admin = admin;
    }

    public Account(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Account() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.admin != null) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else if (this.player != null) {
            return List.of(new SimpleGrantedAuthority("ROLE_PLAYER"));
        } else {
            return List.of();
        }
    }
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }
}
