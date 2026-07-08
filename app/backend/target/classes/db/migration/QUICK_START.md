# Quick Start Guide - Password Reset Migration

## For Developers

### What Changed?
The `users` table now has two new columns for password reset functionality:
- `reset_token` - Stores temporary password reset tokens
- `reset_token_expiry` - Stores when the token expires

### Do I Need to Do Anything?

**In Development (Local Setup):**
✅ **NO ACTION NEEDED** - The columns will be created automatically when you start the application.

The application uses Hibernate's auto-update feature, so the schema changes will be applied automatically based on the updated `User` entity.

**In Production:**
⚠️ **MANUAL MIGRATION REQUIRED** - Run the SQL script manually before deploying.

```bash
# Execute the migration
mysql -u root -p lankathread < V1__add_password_reset_columns.sql
```

### Using the New Fields in Code

The `User` entity now has two new fields:

```java
User user = userRepository.findById(userId).get();

// Set reset token
user.setResetToken("abc-123-def-456");
user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
userRepository.save(user);

// Clear reset token
user.setResetToken(null);
user.setResetTokenExpiry(null);
userRepository.save(user);

// Find user by token
Optional<User> user = userRepository.findByResetToken(token);
```

### Troubleshooting

**Error: "Column 'reset_token' not found"**
- In development: Restart your application
- In production: Run the migration script

**Error: "Duplicate column name"**
- The columns already exist, no action needed
- This can happen if Hibernate already created them

### Verification

After starting your application, verify the changes:

```sql
-- Check if columns exist
DESCRIBE users;

-- You should see:
-- reset_token       | varchar(255) | YES |     | NULL
-- reset_token_expiry| timestamp    | YES |     | NULL
```

### Related Files

- **Migration Script**: `V1__add_password_reset_columns.sql`
- **Rollback Script**: `V1__add_password_reset_columns_ROLLBACK.sql`
- **Verification**: `verify_migration.sql`
- **Full Documentation**: `README.md` and `MIGRATION_SUMMARY.md`

---

**Questions?** Check the full documentation in `README.md` or the design document in `.kiro/specs/forgot-password/design.md`
