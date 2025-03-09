CREATE TABLE direct_messages (
    sender_id   INTEGER NOT NULL REFERENCES accounts(user_id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES accounts(user_id) ON DELETE CASCADE,
    message     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dm_id       SERIAL PRIMARY KEY,

    CONSTRAINT direct_messages_sender_receiver_chk CHECK (sender_id <> receiver_id),
    CONSTRAINT direct_messages_unique UNIQUE (sender_id, receiver_id, created_at)
);

CREATE INDEX dm_sender_idx ON direct_messages (sender_id);
CREATE INDEX dm_receiver_idx ON direct_messages (receiver_id);
CREATE INDEX dm_timestamp_idx ON direct_messages (created_at DESC);

