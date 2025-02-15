-- Converted from Oracle to PostgreSQL syntax
-- Using SERIAL for auto-incrementing primary keys

CREATE TABLE accounts (
                          user_id        SERIAL PRIMARY KEY,
                          username       VARCHAR(50) NOT NULL,
                          email          VARCHAR(320) NOT NULL,
                          password       VARCHAR(150) NOT NULL,
                          player_user_id INTEGER,
                          admin_user_id  INTEGER
);

ALTER TABLE accounts
    ADD CONSTRAINT accounts_arc
        CHECK ( ( player_user_id IS NOT NULL AND admin_user_id IS NULL )
            OR ( admin_user_id IS NOT NULL AND player_user_id IS NULL ) );

CREATE INDEX accounts__idx ON accounts (email, username);
ALTER TABLE accounts ADD CONSTRAINT accounts_un UNIQUE (username, email);

CREATE TABLE admins (
                        user_id          SERIAL PRIMARY KEY,
                        permission_level NUMERIC(1) NOT NULL
);

ALTER TABLE admins
    ADD CONSTRAINT permission_level_check CHECK (permission_level BETWEEN 1 AND 3);

CREATE TABLE friend_requests (
                                 sent_at     TIMESTAMP NOT NULL,
                                 message     VARCHAR(300),
                                 receiver_id INTEGER NOT NULL,
                                 sender_id   INTEGER NOT NULL,
                                 PRIMARY KEY (sender_id, receiver_id)
);

CREATE TABLE friendships (
                             start_at TIMESTAMP NOT NULL,
                             user_id1 INTEGER NOT NULL,
                             user_id2 INTEGER NOT NULL,
                             PRIMARY KEY (user_id1, user_id2)
);

CREATE TABLE game_categories (
                                 game_category_id SERIAL PRIMARY KEY,
                                 name            VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE game_info (
                           game_info_id SERIAL PRIMARY KEY,
                           game_info    VARCHAR(300) NOT NULL,
                           info_label   VARCHAR(10) NOT NULL,
                           game_id      INTEGER NOT NULL,
                           CONSTRAINT info_type_check CHECK (info_label IN ('CONTROL', 'GENERAL'))
);

CREATE TABLE games (
                       game_id     SERIAL PRIMARY KEY,
                       name        VARCHAR(80) NOT NULL UNIQUE,
                       perex       VARCHAR(255),
                       description VARCHAR(500)
);

CREATE INDEX games__idx ON games (name);

CREATE TABLE games_gamecategories (
                                      game_id          INTEGER NOT NULL,
                                      game_category_id INTEGER NOT NULL,
                                      PRIMARY KEY (game_id, game_category_id)
);

CREATE TABLE chat_restrictions (
                                   reason        VARCHAR(100),
                                   start_at      TIMESTAMP NOT NULL,
                                   end_date      TIMESTAMP,
                                   chat_id       INTEGER NOT NULL,
                                   admin_user_id INTEGER,
                                   user_id       INTEGER NOT NULL,
                                   PRIMARY KEY (chat_id, user_id, start_at)
);

CREATE TABLE chats (
                       chat_id SERIAL PRIMARY KEY,
                       public  BOOLEAN NOT NULL,
                       name    VARCHAR(80) UNIQUE
);

CREATE TABLE messages (
                          message_id SERIAL,
                          message    VARCHAR(300) NOT NULL,
                          sent_at    TIMESTAMP NOT NULL,
                          chat_id    INTEGER NOT NULL,
                          user_id    INTEGER NOT NULL,
                          PRIMARY KEY (user_id, chat_id, message_id)
);

CREATE TABLE player_mmrs (
                             mmr            INTEGER NOT NULL CHECK (mmr >= 0),
                             game_id        INTEGER NOT NULL,
                             player_user_id INTEGER NOT NULL,
                             PRIMARY KEY (player_user_id, game_id)
);

CREATE TABLE player_stats (
                              games_played   INTEGER NOT NULL,
                              win_ratio      NUMERIC(3,2) NOT NULL CHECK (win_ratio BETWEEN 0 AND 1),
                              player_user_id INTEGER NOT NULL,
                              game_id        INTEGER NOT NULL,
                              PRIMARY KEY (player_user_id, game_id)
);

CREATE TABLE players (
                         user_id   SERIAL PRIMARY KEY,
                         play_time INTEGER CHECK (play_time >= 0)
);

CREATE TABLE users_chats (
                             user_id INTEGER NOT NULL,
                             chat_id INTEGER NOT NULL,
                             PRIMARY KEY (user_id, chat_id)
);

-- Foreign Key Constraints
ALTER TABLE accounts
    ADD CONSTRAINT account_admin_fk FOREIGN KEY (admin_user_id)
        REFERENCES admins (user_id);

ALTER TABLE accounts
    ADD CONSTRAINT account_player_fk FOREIGN KEY (player_user_id)
        REFERENCES players (user_id);

ALTER TABLE friend_requests
    ADD CONSTRAINT friend_request_receiver_fk FOREIGN KEY (receiver_id)
        REFERENCES accounts (user_id);

ALTER TABLE friend_requests
    ADD CONSTRAINT friend_request_sender_fk FOREIGN KEY (sender_id)
        REFERENCES accounts (user_id);

ALTER TABLE friendships
    ADD CONSTRAINT friendship_account_fk FOREIGN KEY (user_id1)
        REFERENCES accounts (user_id);

ALTER TABLE friendships
    ADD CONSTRAINT friendship_account_fkv2 FOREIGN KEY (user_id2)
        REFERENCES accounts (user_id);

ALTER TABLE game_info
    ADD CONSTRAINT game_info_game_fk FOREIGN KEY (game_id)
        REFERENCES games (game_id);

ALTER TABLE games_gamecategories
    ADD CONSTRAINT gamecategory_category_fk FOREIGN KEY (game_category_id)
        REFERENCES game_categories (game_category_id)
        ON DELETE CASCADE;

ALTER TABLE games_gamecategories
    ADD CONSTRAINT gamecategory_game_fk FOREIGN KEY (game_id)
        REFERENCES games (game_id)
        ON DELETE CASCADE;

ALTER TABLE chat_restrictions
    ADD CONSTRAINT chat_restriction_account_fk FOREIGN KEY (user_id)
        REFERENCES accounts (user_id)
        ON DELETE CASCADE;

ALTER TABLE chat_restrictions
    ADD CONSTRAINT chat_restriction_admin_fk FOREIGN KEY (admin_user_id)
        REFERENCES admins (user_id)
        ON DELETE SET NULL;

ALTER TABLE chat_restrictions
    ADD CONSTRAINT chat_restriction_chat_fk FOREIGN KEY (chat_id)
        REFERENCES chats (chat_id)
        ON DELETE CASCADE;

ALTER TABLE messages
    ADD CONSTRAINT message_account_fk FOREIGN KEY (user_id)
        REFERENCES accounts (user_id);

ALTER TABLE messages
    ADD CONSTRAINT message_chat_fk FOREIGN KEY (chat_id)
        REFERENCES chats (chat_id)
        ON DELETE CASCADE;

ALTER TABLE player_mmrs
    ADD CONSTRAINT player_mmr_game_fk FOREIGN KEY (game_id)
        REFERENCES games (game_id);

ALTER TABLE player_mmrs
    ADD CONSTRAINT player_mmr_player_fk FOREIGN KEY (player_user_id)
        REFERENCES players (user_id)
        ON DELETE CASCADE;

ALTER TABLE player_stats
    ADD CONSTRAINT player_stats_game_fk FOREIGN KEY (game_id)
        REFERENCES games (game_id)
        ON DELETE CASCADE;

ALTER TABLE player_stats
    ADD CONSTRAINT player_stats_player_fk FOREIGN KEY (player_user_id)
        REFERENCES players (user_id)
        ON DELETE CASCADE;

ALTER TABLE users_chats
    ADD CONSTRAINT user_chat_account_fk FOREIGN KEY (user_id)
        REFERENCES accounts (user_id);

ALTER TABLE users_chats
    ADD CONSTRAINT user_chat_chat_fk FOREIGN KEY (chat_id)
        REFERENCES chats (chat_id);

-- Create triggers and functions for business logic
CREATE OR REPLACE FUNCTION check_chat_restriction_admin_permission()
RETURNS TRIGGER AS $$
DECLARE
v_admin_permission_level NUMERIC(1);
    v_target_admin_permission_level NUMERIC(1);
    v_is_target_admin BOOLEAN := FALSE;
    v_is_admin_restricted INTEGER;
BEGIN
    IF NEW.admin_user_id IS NOT NULL THEN
SELECT permission_level INTO v_admin_permission_level
FROM admins
WHERE user_id = NEW.admin_user_id;

BEGIN
SELECT permission_level INTO v_target_admin_permission_level
FROM admins
WHERE user_id = NEW.user_id;
v_is_target_admin := TRUE;
EXCEPTION
            WHEN NO_DATA_FOUND THEN
                v_is_target_admin := FALSE;
END;

SELECT COUNT(*) INTO v_is_admin_restricted
FROM chat_restrictions
WHERE user_id = NEW.admin_user_id
  AND chat_id = NEW.chat_id
  AND (end_date IS NULL OR end_date > CURRENT_TIMESTAMP);

IF v_is_admin_restricted > 0 THEN
            RAISE EXCEPTION 'Admin cannot create a restriction for a chat where they are under restriction.';
END IF;

        IF v_admin_permission_level < 2 THEN
            RAISE EXCEPTION 'Admin creating/updating restriction must have permission level 2 or more.';
END IF;

        IF v_is_target_admin AND v_admin_permission_level <= v_target_admin_permission_level THEN
            RAISE EXCEPTION 'Admin creating/updating restriction must have a higher permission level than the target admin.';
END IF;

        IF NEW.end_date IS NULL AND v_admin_permission_level < 3 THEN
            RAISE EXCEPTION 'Admin must have permission level 3 or higher to create a chat restriction with no end date.';
END IF;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chat_restriction_admin_permission_check
    BEFORE INSERT OR UPDATE ON chat_restrictions
                         FOR EACH ROW
                         EXECUTE FUNCTION check_chat_restriction_admin_permission();

CREATE OR REPLACE FUNCTION check_chat_restriction_admin_user_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.admin_user_id IS NULL THEN
        RAISE EXCEPTION 'admin_user_id cannot be NULL for chat_restriction, while creating.';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chat_restriction_admin_user_id_check
    BEFORE INSERT ON chat_restrictions
    FOR EACH ROW
    EXECUTE FUNCTION check_chat_restriction_admin_user_id();

CREATE OR REPLACE FUNCTION delete_friend_request()
RETURNS TRIGGER AS $$
BEGIN
DELETE FROM friend_requests
WHERE (sender_id = NEW.user_id1 AND receiver_id = NEW.user_id2)
   OR (sender_id = NEW.user_id2 AND receiver_id = NEW.user_id1);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delete_friend_request
    AFTER INSERT ON friendships
    FOR EACH ROW
    EXECUTE FUNCTION delete_friend_request();

CREATE OR REPLACE FUNCTION prevent_friend_request()
RETURNS TRIGGER AS $$
DECLARE
v_count INTEGER;
BEGIN
SELECT COUNT(*) INTO v_count
FROM friendships
WHERE (user_id1 = NEW.sender_id AND user_id2 = NEW.receiver_id)
   OR (user_id1 = NEW.receiver_id AND user_id2 = NEW.sender_id);

IF v_count > 0 THEN
        RAISE EXCEPTION 'Friend request cannot be created: users are already friends.';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_friend_request
    BEFORE INSERT ON friend_requests
    FOR EACH ROW
    EXECUTE FUNCTION prevent_friend_request();

CREATE OR REPLACE FUNCTION check_date_not_past()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sent_at < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Date cannot be in the past.';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Reuse the same function for all date checks
CREATE TRIGGER trg_friend_request_start
    BEFORE INSERT OR UPDATE ON friend_requests
                         FOR EACH ROW
                         EXECUTE FUNCTION check_date_not_past();

CREATE TRIGGER trg_friendships_start
    BEFORE INSERT OR UPDATE ON friendships
                         FOR EACH ROW
                         EXECUTE FUNCTION check_date_not_past();

CREATE TRIGGER trg_messages_start
    BEFORE INSERT OR UPDATE ON messages
                         FOR EACH ROW
                         EXECUTE FUNCTION check_date_not_past();

CREATE OR REPLACE FUNCTION check_chat_restrictions_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.start_at < CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'start_at cannot be in the past.';
END IF;

    IF NEW.end_date IS NOT NULL AND NEW.end_date < NEW.start_at THEN
        RAISE EXCEPTION 'end_date cannot be earlier than start_at.';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chat_restrictions_dates
    BEFORE INSERT OR UPDATE ON chat_restrictions
                         FOR EACH ROW
                         EXECUTE FUNCTION check_chat_restrictions_dates();
