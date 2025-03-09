package com.tarnai.duelovky;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories({"com.tarnai.duelovky.users.repositories", "com.tarnai.duelovky.friendShips.repositories", "com.tarnai.duelovky.dms.repositories"})
public class DuelovkyApplication {

	public static void main(String[] args) {
		System.setProperty("spring.devtools.restart.enabled", "true");
		SpringApplication.run(DuelovkyApplication.class, args);
	}
}
