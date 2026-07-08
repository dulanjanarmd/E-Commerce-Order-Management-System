# Database Migration Scripts

## Overview

This directory contains SQL migration scripts for the LankaThread database schema changes.

## Migration Strategy

The LankaThread application uses **Hibernate's automatic schema update** feature (`spring.jpa.hibernate.ddl-auto=update`), which means schema changes defined in JPA entities will be automatically applied when the application starts.

However, migration scripts are provided here for:
- Manual execution in production environments
- Documentation of schema changes
- Rollback capabilities
- Environments where automatic schema updates are disabled

## Available Migrations

### V1__add_password_reset_columns.sql

**Purpose**: Add password reset functionality to the users table

**Changes**:
- Adds `reset_token` VARCHAR(255) NULL column
- Adds `reset_token_expiry` TIMESTAMP NULL column
- Creates index on `reset_token` for performance

**Requirements Addressed**: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6

**Related Feature**: Forgot Password feature

**Execution**:
```sql
-- Connect to your MySQL database
mysql -u root -p lankathread

-- Execute the migration
source V1__add_password_reset_columns.sql;

-- Verify the changes
DESCRIBE users;
```

**Rollback** (if needed):
```sql
ALTER TABLE users DROP INDEX idx_users_reset_token;
ALTER TABLE users DROP COLUMN reset_token_expiry;
ALTER TABLE users DROP COLUMN reset_token;
```

## Migration Best Practices

1. **Automatic Execution**: With `spring.jpa.hibernate.ddl-auto=update`, the User entity changes will automatically create these columns when the application starts.

2. **Manual Execution**: For production environments, it's recommended to:
   - Set `spring.jpa.hibernate.ddl-auto=validate` or `none`
   - Execute migration scripts manually during deployment
   - Test migrations on a staging environment first

3. **Backup**: Always backup your database before applying migrations:
   ```bash
   mysqldump -u root -p lankathread > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

4. **Verification**: After migration, verify the changes:
   ```sql
   -- Check if columns exist
   SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
   FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = 'lankathread'
     AND TABLE_NAME = 'users'
     AND COLUMN_NAME IN ('reset_token', 'reset_token_expiry');
   
   -- Check if index exists
   SHOW INDEX FROM users WHERE Key_name = 'idx_users_reset_token';
   ```

## Future Migrations

When adding new migration scripts:
1. Follow the naming convention: `V{version}__{description}.sql`
2. Include comments explaining the purpose and requirements addressed
3. Update this README with migration details and rollback instructions
4. Test thoroughly in development before production deployment

## Troubleshooting

### "Column already exists" error
If you see this error, the column was already created by Hibernate's automatic schema update. This is normal and can be safely ignored.

### Permission denied
Ensure the database user has ALTER TABLE privileges:
```sql
GRANT ALTER ON lankathread.* TO 'your_user'@'localhost';
```

### Index creation failure
If the index already exists, drop it first:
```sql
DROP INDEX idx_users_reset_token ON users;
```
