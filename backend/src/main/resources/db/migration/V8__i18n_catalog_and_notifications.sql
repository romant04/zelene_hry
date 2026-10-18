-- Stable game codes for routing / image mapping (independent of display language)
ALTER TABLE games ADD COLUMN IF NOT EXISTS code VARCHAR(50);

UPDATE games SET code = 'prsi' WHERE game_id = 1 AND (code IS NULL OR code = '');
UPDATE games SET code = 'slovnifotbal' WHERE game_id = 2 AND (code IS NULL OR code = '');
UPDATE games SET code = 'horolezci' WHERE game_id = 3 AND (code IS NULL OR code = '');

ALTER TABLE games ALTER COLUMN code SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'games_code_un'
    ) THEN
        ALTER TABLE games ADD CONSTRAINT games_code_un UNIQUE (code);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS game_translations (
    game_id     INTEGER NOT NULL REFERENCES games (game_id) ON DELETE CASCADE,
    locale      VARCHAR(5) NOT NULL,
    name        VARCHAR(80) NOT NULL,
    perex       VARCHAR(255),
    description VARCHAR(500),
    PRIMARY KEY (game_id, locale)
);

CREATE TABLE IF NOT EXISTS game_info_translations (
    game_info_id INTEGER NOT NULL REFERENCES game_info (game_info_id) ON DELETE CASCADE,
    locale       VARCHAR(5) NOT NULL,
    game_info    TEXT NOT NULL,
    PRIMARY KEY (game_info_id, locale)
);

CREATE TABLE IF NOT EXISTS game_category_translations (
    game_category_id INTEGER NOT NULL REFERENCES game_categories (game_category_id) ON DELETE CASCADE,
    locale           VARCHAR(5) NOT NULL,
    name             VARCHAR(80) NOT NULL,
    PRIMARY KEY (game_category_id, locale)
);

-- Czech copies of existing catalog rows
INSERT INTO game_translations (game_id, locale, name, perex, description)
SELECT game_id, 'cs', name, perex, description
FROM games
ON CONFLICT (game_id, locale) DO NOTHING;

INSERT INTO game_info_translations (game_info_id, locale, game_info)
SELECT game_info_id, 'cs', game_info
FROM game_info
ON CONFLICT (game_info_id, locale) DO NOTHING;

INSERT INTO game_category_translations (game_category_id, locale, name)
SELECT game_category_id, 'cs', name
FROM game_categories
ON CONFLICT (game_category_id, locale) DO NOTHING;

-- English game translations
INSERT INTO game_translations (game_id, locale, name, perex, description) VALUES
(
    1,
    'en',
    'Prší',
    'Play the classic Czech card game Prší and battle your opponent with strategy and quick thinking! The first to get rid of all cards wins!',
    'Prší is a card game for 2 to 4 players. The goal is to get rid of all your cards as quickly as possible. Players take turns playing cards of the same suit or rank. Special cards like the seven, ace, or jack have unique effects that change the course of the game. The first player to empty their hand wins. The game mixes strategy, luck, and fast decisions.'
),
(
    2,
    'en',
    'Word Football',
    'Compete against your opponent in a game that tests your vocabulary and eyesight. Who can build more words before time runs out?',
    'Word Football is a one-on-one word game where you form words from random letters. Each word scores points based on its length. Words are checked against a specialized dictionary of Czech nouns in the nominative case. Words not in the dictionary are invalid. Whoever has more points when the timer ends wins.'
),
(
    3,
    'en',
    'Climbers',
    'Climbers tests your knowledge of sayings and proverbs. Will you risk it for more points or play it safe? That choice can decide who reaches the summit first.',
    'Climbers is a two-player word knowledge game. Players fill in a secret phrase by picking letters, each with a point value based on estimated risk. A correct guess moves you up; a wrong one sends you down. The first player to reach the mountain top wins.'
)
ON CONFLICT (game_id, locale) DO UPDATE SET
    name = EXCLUDED.name,
    perex = EXCLUDED.perex,
    description = EXCLUDED.description;

-- English category translations
INSERT INTO game_category_translations (game_category_id, locale, name) VALUES
    (1, 'en', 'Word game'),
    (2, 'en', 'Logic'),
    (3, 'en', 'Card'),
    (4, 'en', 'Tactical')
ON CONFLICT (game_category_id, locale) DO UPDATE SET name = EXCLUDED.name;

-- English game info translations (by known IDs from production data)
INSERT INTO game_info_translations (game_info_id, locale, game_info) VALUES
    -- Slovní fotbal
    (1, 'en', '-The goal is to build as many words as possible before the timer runs out'),
    (2, 'en', '-The total time limit is 3 minutes'),
    (4, 'en', '-Players earn points based on the length of the words they build'),
    (8, 'en', '-The player builds words by connecting letters from the circle with a mouse drag'),
    (9, 'en', '-When the player stops dragging, the formed word is automatically submitted for validation'),
    -- Prší
    (14, 'en', '-The main goal is to get rid of all cards in your hand'),
    (15, 'en', '-You can play cards to the center if they share the same suit or rank. Special cards can change this'),
    (16, 'en', '-An ace forces the opponent to also play an ace. If they do not have one, they must pass the turn'),
    (17, 'en', '-A jack (changer) lets you change the active suit. It can be played on any card except an ace or a seven'),
    (18, 'en', '-A seven forces the opponent to also play a seven, otherwise they draw 2 cards. Playing another seven passes the penalty back, stacking by 2 cards up to a maximum of 8 cards with 4 sevens.'),
    (19, 'en', 'There are 3 main elements: the draw pile, cards in hand, and the token'),
    (20, 'en', '-Clicking the draw pile draws a card into your hand'),
    (21, 'en', '-Dragging a card from your hand to the center plays it'),
    (22, 'en', '-If you must respond to an ace but have none, click the token to pass the turn'),
    (23, 'en', '-The token shows the active suit, which can be changed with a jack'),
    -- Horolezci
    (24, 'en', '-Players simultaneously try to fill letters from the pyramid into the secret phrase'),
    (25, 'en', '-Each letter is scored by how common it is and where it sits in the pyramid'),
    (26, 'en', '-A wrong letter moves the player down, at most to the ground or the nearest safety point'),
    (27, 'en', '-The first player to reach the summit wins'),
    (28, 'en', '-The player picks letters from the letter pyramid (higher letters are worth more points)'),
    (29, 'en', '-At any time, instead of guessing a letter, the player can place a safety point so they cannot fall below that level')
ON CONFLICT (game_info_id, locale) DO UPDATE SET game_info = EXCLUDED.game_info;

-- Notifications: store translation key + params instead of a fixed-language sentence
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS message_key VARCHAR(100);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS message_params TEXT;

ALTER TABLE notifications ALTER COLUMN message DROP NOT NULL;
