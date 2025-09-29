-- Live Your Dreams Backoffice
-- Initial Database Setup for Production
-- Generated: 2025-09-25

-- Create admin user
-- Password: 'changeme123' (bcrypt hashed)
-- WICHTIG: Ändere das Passwort nach dem ersten Login!
INSERT INTO "User" (
  id,
  email,
  password,
  name,
  role,
  "isActive",
  "isVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin_001',
  'admin@liveyourdreams.online',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMst.a7WUl31ZLu',
  'System Administrator',
  'admin',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create demo user  
-- Password: 'demo123' (bcrypt hashed)
INSERT INTO "User" (
  id,
  email,
  password,
  name,
  role,
  "isActive",
  "isVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  'demo_001',
  'demo@liveyourdreams.online',
  '$2b$12$hashed_demo_password_here',
  'Demo User',
  'user',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create initial categories for blog
INSERT INTO "Category" (id, name, slug, description, "createdAt", "updatedAt") VALUES
('cat_001', 'Immobilien', 'immobilien', 'Artikel über Immobilien und Investments', NOW(), NOW()),
('cat_002', 'Lifestyle', 'lifestyle', 'Lifestyle und Luxus Content', NOW(), NOW()),
('cat_003', 'Marktanalyse', 'marktanalyse', 'Marktanalysen und Trends', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Create initial tags
INSERT INTO "Tag" (id, name, slug, "createdAt", "updatedAt") VALUES
('tag_001', 'Investment', 'investment', NOW(), NOW()),
('tag_002', 'Luxury', 'luxury', NOW(), NOW()),
('tag_003', 'Dubai', 'dubai', NOW(), NOW()),
('tag_004', 'München', 'muenchen', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Verify setup
SELECT COUNT(*) as user_count FROM "User";
SELECT COUNT(*) as category_count FROM "Category";
SELECT COUNT(*) as tag_count FROM "Tag";

-- Success message
SELECT 'Database initialization complete!' as status;

