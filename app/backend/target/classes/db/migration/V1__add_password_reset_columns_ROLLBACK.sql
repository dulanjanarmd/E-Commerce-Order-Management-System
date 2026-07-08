-- Rollback script for V1__add_password_reset_columns.sql
-- This script reverses the changes made by the password reset columns migration
-- Created: 2024
-- Use Case: Rollback the forgot password feature database changes

-- Drop the index first
DROP INDEX IF EXISTS idx_users_reset_token ON users;

-- Remove the reset_token_expiry column
ALTER TABLE users DROP COLUMN IF EXISTS reset_token_expiry;

-- Remove the reset_token column
ALTER TABLE users DROP COLUMN IF EXISTS reset_token;
