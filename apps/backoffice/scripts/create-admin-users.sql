-- CRITICAL: CREATE ADMIN USERS FOR PRODUCTION
-- Run this against your Neon PostgreSQL Database

-- 1. Create Admin User
INSERT INTO "User" (
  id,
  email, 
  password,
  name,
  "firstName",
  "lastName",
  "isActive",
  "isVerified",
  "emailVerified",
  "createdAt",
  "updatedAt"
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
  "isActive" = true,
  "isVerified" = true,
  "updatedAt" = NOW();

-- 2. Create Demo User  
INSERT INTO "User" (
  id,
  email,
  password, 
  name,
  "firstName",
  "lastName",
  "isActive",
  "isVerified", 
  "emailVerified",
  "createdAt",
  "updatedAt"
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
  "isActive" = true,
  "isVerified" = true,
  "updatedAt" = NOW();

-- 3. Create Basic Roles
INSERT INTO "Role" (
  id,
  name,
  "displayName",
  description,
  color,
  "isActive",
  "createdAt",
  "updatedAt" 
) VALUES
  ('role_admin', 'admin', 'Administrator', 'System Administrator with full access', '#ef4444', true, NOW(), NOW()),
  ('role_editor', 'editor', 'Editor', 'Content Editor with write access', '#3b82f6', true, NOW(), NOW()),
  ('role_viewer', 'viewer', 'Viewer', 'Read-only access', '#6b7280', true, NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
  "displayName" = EXCLUDED."displayName",
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  "isActive" = true,
  "updatedAt" = NOW();

-- 4. Create Basic Permissions
INSERT INTO "Permission" (
  id,
  name,
  "displayName", 
  description,
  category,
  "createdAt",
  "updatedAt"
) VALUES
  ('perm_users_read', 'users.read', 'Read Users', 'View user list and details', 'users', NOW(), NOW()),
  ('perm_users_write', 'users.write', 'Write Users', 'Create and edit users', 'users', NOW(), NOW()),  
  ('perm_users_delete', 'users.delete', 'Delete Users', 'Delete users', 'users', NOW(), NOW()),
  ('perm_content_read', 'content.read', 'Read Content', 'View content', 'content', NOW(), NOW()),
  ('perm_content_write', 'content.write', 'Write Content', 'Create and edit content', 'content', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 5. Assign Admin Role to Admin User
INSERT INTO "UserRole" (
  id,
  "userId",
  "roleId", 
  "assignedAt",
  "assignedBy"
) VALUES (
  'ur_admin_001',
  'admin_001',
  'role_admin',
  NOW(),
  'system'
) ON CONFLICT (id) DO NOTHING;

-- 6. Assign Editor Role to Demo User
INSERT INTO "UserRole" (
  id,
  "userId", 
  "roleId",
  "assignedAt", 
  "assignedBy"
) VALUES (
  'ur_demo_001',
  'demo_001',
  'role_editor', 
  NOW(),
  'system'  
) ON CONFLICT (id) DO NOTHING;

-- 7. Assign Permissions to Admin Role
INSERT INTO "RolePermission" (
  id,
  "roleId",
  "permissionId",
  "assignedAt" 
) VALUES
  ('rp_admin_users_read', 'role_admin', 'perm_users_read', NOW()),
  ('rp_admin_users_write', 'role_admin', 'perm_users_write', NOW()),
  ('rp_admin_users_delete', 'role_admin', 'perm_users_delete', NOW()),
  ('rp_admin_content_read', 'role_admin', 'perm_content_read', NOW()),
  ('rp_admin_content_write', 'role_admin', 'perm_content_write', NOW())
ON CONFLICT (id) DO NOTHING;

-- 8. Assign Permissions to Editor Role  
INSERT INTO "RolePermission" (
  id,
  "roleId",
  "permissionId",
  "assignedAt"
) VALUES
  ('rp_editor_users_read', 'role_editor', 'perm_users_read', NOW()),
  ('rp_editor_content_read', 'role_editor', 'perm_content_read', NOW()),
  ('rp_editor_content_write', 'role_editor', 'perm_content_write', NOW())
ON CONFLICT (id) DO NOTHING;

-- VERIFICATION QUERIES:
-- SELECT * FROM "User" WHERE email IN ('admin@liveyourdreams.online', 'demo@liveyourdreams.online');
-- SELECT * FROM "Role";  
-- SELECT * FROM "Permission";
-- SELECT * FROM "UserRole";
-- SELECT * FROM "RolePermission";
