-- Drop the old constraint
ALTER TABLE accounts
DROP CONSTRAINT accounts_un;

-- Add the new individual unique constraints
ALTER TABLE accounts
    ADD CONSTRAINT unique_username UNIQUE (username),
    ADD CONSTRAINT unique_email UNIQUE (email);
