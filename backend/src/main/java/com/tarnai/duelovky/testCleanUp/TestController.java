package com.tarnai.duelovky.testCleanUp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;

@Profile("test")
@RestController
@RequestMapping("/test-api")
public class TestController {
    @Autowired
    public DataSource dataSource;

    @PostMapping("/reset")
    public void resetDatabase() {
        // REMOVE ALL DATA CREATED BY TESTING (do not delete default test users)
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("TRUNCATE TABLE friendships RESTART IDENTITY CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE direct_messages RESTART IDENTITY CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE friend_requests RESTART IDENTITY CASCADE");
        jdbcTemplate.execute("DELETE FROM accounts WHERE email != 'test@test.test' AND email != 'test.friend@gmail.com'");
        jdbcTemplate.execute("DELETE FROM players USING accounts WHERE accounts.player_user_id = players.user_id AND (accounts.email != 'test@test.test' AND accounts.email != 'test.friend@gmail.com')");
        // TODO: Remove friendships - in new version you are not able to send a request repeatedly, the request must be accepted or rejected first

        // INSERT DEFAULT TEST DATA
        jdbcTemplate.execute("INSERT INTO friend_requests (sender_id, receiver_id, message, sent_at) VALUES (12, 13, 'This is a test message!', NOW()) ON CONFLICT DO NOTHING");
    }
}
