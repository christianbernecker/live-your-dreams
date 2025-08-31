-- Life Your Dreams Database Initialization

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create database if not exists
SELECT 'CREATE DATABASE lyd_dev' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lyd_dev');
