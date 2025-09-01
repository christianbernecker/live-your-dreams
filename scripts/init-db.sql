-- Live Your Dreams Database Initialization
-- This script sets up the initial database structure for local development

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create the main database user
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'lyd_user') THEN
        CREATE ROLE lyd_user WITH LOGIN PASSWORD 'lyd_password';
    END IF;
END
$$;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE lyd_dev TO lyd_user;
GRANT ALL ON SCHEMA public TO lyd_user;
GRANT CREATE ON SCHEMA public TO lyd_user;

-- Set up database for production-like environment
ALTER DATABASE lyd_dev SET timezone TO 'Europe/Berlin';

-- Ready message
DO $$
BEGIN
    RAISE NOTICE '✅ Live Your Dreams database initialized successfully';
    RAISE NOTICE '📊 Database: lyd_dev';
    RAISE NOTICE '👤 User: lyd_user';
    RAISE NOTICE '🌍 Timezone: Europe/Berlin';
END
$$;
