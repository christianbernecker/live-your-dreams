-- Migration: Add 2FA Backup Codes Support
-- Date: 2024-01-20
-- Description: Adds totpBackupCodes field to users table for storing hashed backup codes

-- Add the backup codes field to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "totpBackupCodes" JSONB;

-- Create index for better query performance on 2FA enabled users
CREATE INDEX IF NOT EXISTS "idx_users_totp_enabled" ON "users" ("totpEnabled") WHERE "totpEnabled" = true;

-- Add comments for documentation
COMMENT ON COLUMN "users"."totpBackupCodes" IS 'Array of hashed backup codes for 2FA recovery (JSON)';
COMMENT ON COLUMN "users"."totpSecret" IS 'Base32 encoded TOTP secret for 2FA authentication';
COMMENT ON COLUMN "users"."totpEnabled" IS 'Whether two-factor authentication is enabled for this user';
