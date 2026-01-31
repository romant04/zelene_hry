package com.tarnai.duelovky.socialDashboard.controllers;

import com.tarnai.duelovky.socialDashboard.dto.SocialDashboardDTO;
import com.tarnai.duelovky.socialDashboard.services.SocialAggregatorService;
import com.tarnai.duelovky.users.entity.Account;
import com.tarnai.duelovky.users.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secured/socialDashboard")
public class SocialDashboardController {
    private final SocialAggregatorService socialAggregatorService;
    private final UserService userService;

    @Autowired
    public SocialDashboardController(SocialAggregatorService socialAggregatorService, UserService userService) {
        this.socialAggregatorService = socialAggregatorService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<SocialDashboardDTO> getSocialPage(Authentication authentication) {
        Account acc = userService.getUsersBySearchTerm(authentication.getName()).stream().findFirst().orElse(null);

        if (acc == null) {
            return ResponseEntity.badRequest().build();
        }

        SocialDashboardDTO dashboard = socialAggregatorService.getSocialDashboardData(acc);
        return ResponseEntity.ok(dashboard);
    }
}
