-- FIXED: CREATE ADMIN USERS FOR PRODUCTION
-- Run this against your Neon PostgreSQL Database
-- Uses correct table names from Prisma schema (@@map)

-- 1. Create Admin User (table name: "users" not "User")
INSERT INTO "users" (
  id,
  email, 
  password,
  name,
  "first_name",
  "last_name",
  "is_active",
  "is_verified",
  "email_verified",
  "created_at",
  "updated_at"
) VALUES (
  'admin_001',
  'admin@liveyourdreams.online',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMst.a7WUl31ZLu', -- "changeme123"
  'System Administrator',
  'System',
  'Administrator', 
  true,
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  "is_active" = true,
  "is_verified" = true,
  "updated_at" = NOW();

-- 2. Create Demo User  
INSERT INTO "users" (
  id,
  email,
  password, 
  name,
  "first_name",
  "last_name",
  "is_active",
  "is_verified", 
  "email_verified",
  "created_at",
  "updated_at"
) VALUES (
  'demo_001', 
  'demo@liveyourdreams.online',
  '$2b$12$K8QKmvR5P3yN9VoF4xQJ3OM8ZvY7sZqP2nC4pR5tS9vQ1mY7nP5jK', -- "demo123"
  'Demo User',
  'Demo', 
  'User',
  true,
  true,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  "is_active" = true,
  "is_verified" = true,
  "updated_at" = NOW();

-- 3. Create Basic Roles (table name: "roles")
INSERT INTO "roles" (
  id,
  name,
  "display_name",
  description,
  color,
  "is_active",
  "created_at",
  "updated_at" 
) VALUES
  ('role_admin', 'admin', 'Administrator', 'System Administrator with full access', '#ef4444', true, NOW(), NOW()),
  ('role_editor', 'editor', 'Editor', 'Content Editor with write access', '#3b82f6', true, NOW(), NOW()),
  ('role_viewer', 'viewer', 'Viewer', 'Read-only access', '#6b7280', true, NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
  "display_name" = EXCLUDED."display_name",
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  "is_active" = true,
  "updated_at" = NOW();

-- 4. Create Basic Permissions (table name: "permissions") 
INSERT INTO "permissions" (
  id,
  name,
  "display_name", 
  description,
  module,
  action,
  "created_at"
) VALUES
  ('perm_users_read', 'users.read', 'Read Users', 'View user list and details', 'users', 'read', NOW()),
  ('perm_users_write', 'users.write', 'Write Users', 'Create and edit users', 'users', 'write', NOW()),  
  ('perm_users_delete', 'users.delete', 'Delete Users', 'Delete users', 'users', 'delete', NOW()),
  ('perm_content_read', 'content.read', 'Read Content', 'View content', 'content', 'read', NOW()),
  ('perm_content_write', 'content.write', 'Write Content', 'Create and edit content', 'content', 'write', NOW())
ON CONFLICT (name) DO NOTHING;

-- 5. Assign Admin Role to Admin User (table name: "user_roles")
INSERT INTO "user_roles" (
  id,
  "user_id",
  "role_id", 
  "assigned_at",
  "assigned_by"
) VALUES (
  'ur_admin_001',
  'admin_001',
  'role_admin',
  NOW(),
  'system'
) ON CONFLICT (id) DO NOTHING;

-- 6. Assign Editor Role to Demo User
INSERT INTO "user_roles" (
  id,
  "user_id", 
  "role_id",
  "assigned_at", 
  "assigned_by"
) VALUES (
  'ur_demo_001',
  'demo_001',
  'role_editor', 
  NOW(),
  'system'  
) ON CONFLICT (id) DO NOTHING;

-- 7. Assign Permissions to Admin Role (table name: "role_permissions")
INSERT INTO "role_permissions" (
  id,
  "role_id",
  "permission_id",
  "created_at" 
) VALUES
  ('rp_admin_users_read', 'role_admin', 'perm_users_read', NOW()),
  ('rp_admin_users_write', 'role_admin', 'perm_users_write', NOW()),
  ('rp_admin_users_delete', 'role_admin', 'perm_users_delete', NOW()),
  ('rp_admin_content_read', 'role_admin', 'perm_content_read', NOW()),
  ('rp_admin_content_write', 'role_admin', 'perm_content_write', NOW())
ON CONFLICT (id) DO NOTHING;

-- 8. Assign Permissions to Editor Role  
INSERT INTO "role_permissions" (
  id,
  "role_id",
  "permission_id",
  "created_at"
) VALUES
  ('rp_editor_users_read', 'role_editor', 'perm_users_read', NOW()),
  ('rp_editor_content_read', 'role_editor', 'perm_content_read', NOW()),
  ('rp_editor_content_write', 'role_editor', 'perm_content_write', NOW())
ON CONFLICT (id) DO NOTHING;

-- VERIFICATION QUERIES:
-- SELECT * FROM "users" WHERE email IN ('admin@liveyourdreams.online', 'demo@liveyourdreams.online');
-- SELECT * FROM "roles";  
-- SELECT * FROM "permissions";
-- SELECT * FROM "user_roles";
-- SELECT * FROM "role_permissions";
