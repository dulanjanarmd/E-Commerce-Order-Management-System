-- Verification script for password reset columns migration
-- Run this script after applying the migration to verify the changes

-- Check if the columns exist with correct data types
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'lankathread'
  AND TABLE_NAME = 'users'
  AND COLUMN_NAME IN ('reset_token', 'reset_token_expiry')
ORDER BY COLUMN_NAME;

-- Expected output:
-- COLUMN_NAME          | DATA_TYPE | CHARACTER_MAXIMUM_LENGTH | IS_NULLABLE | COLUMN_COMMENT
-- reset_token          | varchar   | 255                      | YES         | Stores the unique password reset token (UUID format)
-- reset_token_expiry   | timestamp | NULL                     | YES         | Stores the expiration timestamp for the reset token (15-minute validity)

-- Check if the index exists
SHOW INDEX FROM users WHERE Key_name = 'idx_users_reset_token';

-- Expected output:
-- Table | Non_unique | Key_name                | Seq_in_index | Column_name | Collation | Cardinality | Index_type
-- users | 1          | idx_users_reset_token   | 1            | reset_token | A         | NULL        | BTREE

-- Check the full users table structure
DESCRIBE users;

-- Test that the columns accept NULL values (should succeed)
SELECT id, email, reset_token, reset_token_expiry 
FROM users 
WHERE reset_token IS NULL 
LIMIT 5;

-- Verify no existing data was affected (all reset columns should be NULL for existing users)
SELECT 
    COUNT(*) as total_users,
    COUNT(reset_token) as users_with_token,
    COUNT(reset_token_expiry) as users_with_expiry
FROM users;

-- Expected output: users_with_token and users_with_expiry should both be 0 initially

-- Test insert capability (optional - rollback after testing)
-- START TRANSACTION;
-- UPDATE users SET reset_token = 'test-token-123', reset_token_expiry = NOW() + INTERVAL 15 MINUTE WHERE id = 1;
-- SELECT id, email, reset_token, reset_token_expiry FROM users WHERE id = 1;
-- ROLLBACK;

SELECT 'Migration verification completed successfully!' AS status;
