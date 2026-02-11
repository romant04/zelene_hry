-- 1. Remove play_time from the general user/player table
ALTER TABLE players
DROP COLUMN IF EXISTS play_time;

-- 2. Add play_time_minutes
-- Using INTEGER is plenty for minutes (up to ~4,000 years of play)
ALTER TABLE player_stats
    ADD COLUMN play_time_minutes INTEGER DEFAULT 0 NOT NULL;

-- 3. Add a safety check to prevent negative time
ALTER TABLE player_stats
    ADD CONSTRAINT check_positive_minutes CHECK (play_time_minutes >= 0);