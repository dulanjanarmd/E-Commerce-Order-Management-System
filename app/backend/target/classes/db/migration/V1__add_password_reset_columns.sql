-- Migration script to add password reset functionality to users table
-- Created: 2024
-- Purpose: Support secure password reset with time-limited tokens

-- Add reset_token column to store password reset tokens
ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL 
COMMENT 'Stores the unique password reset token (UUID format)';

-- Add reset_token_expiry column to store token expiration timestamps
ALTER TABLE users 
ADD COLUMN reset_token_expiry TIMESTAMP NULL 
COMMENT 'Stores the expiration timestamp for the reset token (15-minute validity)';

-- Create index on reset_token for faster lookups during token validation
CREATE INDEX idx_users_reset_token ON users(reset_token);
