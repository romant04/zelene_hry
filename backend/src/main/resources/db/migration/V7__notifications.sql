CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES accounts(user_id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    redirect_url TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX notifications_user_id_idx ON notifications (user_id);
CREATE INDEX notifications_user_unread_idx ON notifications (user_id, is_read);
CREATE INDEX notifications_created_at_idx ON notifications (created_at DESC);