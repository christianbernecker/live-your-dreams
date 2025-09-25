-- PostgreSQL Seed Data for LYD Backoffice
-- Password: admin123 (hashed with bcrypt)

-- Create roles
INSERT INTO roles (id, name, display_name, description, color, is_active, created_at, updated_at) VALUES
('role_admin_001', 'admin', 'Administrator', 'Full access to all features and settings.', '#dc2626', true, NOW(), NOW()),
('role_editor_001', 'editor', 'Editor', 'Can create and manage content but has limited access to settings.', '#2563eb', true, NOW(), NOW()),
('role_viewer_001', 'viewer', 'Viewer', 'Read-only access to most content.', '#16a34a', true, NOW(), NOW());

-- Create permissions
INSERT INTO permissions (id, name, display_name, description, category, created_at) VALUES
-- User Management
('perm_users_create', 'users:create', 'Create Users', 'Create new user accounts', 'User Management', NOW()),
('perm_users_read', 'users:read', 'View Users', 'View user accounts and profiles', 'User Management', NOW()),
('perm_users_update', 'users:update', 'Edit Users', 'Edit user accounts and profiles', 'User Management', NOW()),
('perm_users_delete', 'users:delete', 'Delete Users', 'Delete user accounts', 'User Management', NOW()),

-- Role Management
('perm_roles_create', 'roles:create', 'Create Roles', 'Create new roles', 'Role Management', NOW()),
('perm_roles_read', 'roles:read', 'View Roles', 'View roles and permissions', 'Role Management', NOW()),
('perm_roles_update', 'roles:update', 'Edit Roles', 'Edit roles and assign permissions', 'Role Management', NOW()),
('perm_roles_delete', 'roles:delete', 'Delete Roles', 'Delete roles', 'Role Management', NOW()),

-- Content Management
('perm_posts_create', 'posts:create', 'Create Posts', 'Create new blog posts', 'Content Management', NOW()),
('perm_posts_read', 'posts:read', 'View Posts', 'View blog posts', 'Content Management', NOW()),
('perm_posts_update', 'posts:update', 'Edit Posts', 'Edit blog posts', 'Content Management', NOW()),
('perm_posts_delete', 'posts:delete', 'Delete Posts', 'Delete blog posts', 'Content Management', NOW()),
('perm_posts_publish', 'posts:publish', 'Publish Posts', 'Publish and unpublish posts', 'Content Management', NOW()),

-- Media Management
('perm_media_create', 'media:create', 'Upload Media', 'Upload images and files', 'Media Management', NOW()),
('perm_media_read', 'media:read', 'View Media', 'View media library', 'Media Management', NOW()),
('perm_media_update', 'media:update', 'Edit Media', 'Edit media metadata', 'Media Management', NOW()),
('perm_media_delete', 'media:delete', 'Delete Media', 'Delete media files', 'Media Management', NOW()),

-- Settings
('perm_settings_read', 'settings:read', 'View Settings', 'View system settings', 'Settings', NOW()),
('perm_settings_update', 'settings:update', 'Update Settings', 'Update system settings', 'Settings', NOW());

-- Assign all permissions to admin role
INSERT INTO role_permissions (id, role_id, permission_id, created_at) VALUES
('rp_admin_users_create', 'role_admin_001', 'perm_users_create', NOW()),
('rp_admin_users_read', 'role_admin_001', 'perm_users_read', NOW()),
('rp_admin_users_update', 'role_admin_001', 'perm_users_update', NOW()),
('rp_admin_users_delete', 'role_admin_001', 'perm_users_delete', NOW()),
('rp_admin_roles_create', 'role_admin_001', 'perm_roles_create', NOW()),
('rp_admin_roles_read', 'role_admin_001', 'perm_roles_read', NOW()),
('rp_admin_roles_update', 'role_admin_001', 'perm_roles_update', NOW()),
('rp_admin_roles_delete', 'role_admin_001', 'perm_roles_delete', NOW()),
('rp_admin_posts_create', 'role_admin_001', 'perm_posts_create', NOW()),
('rp_admin_posts_read', 'role_admin_001', 'perm_posts_read', NOW()),
('rp_admin_posts_update', 'role_admin_001', 'perm_posts_update', NOW()),
('rp_admin_posts_delete', 'role_admin_001', 'perm_posts_delete', NOW()),
('rp_admin_posts_publish', 'role_admin_001', 'perm_posts_publish', NOW()),
('rp_admin_media_create', 'role_admin_001', 'perm_media_create', NOW()),
('rp_admin_media_read', 'role_admin_001', 'perm_media_read', NOW()),
('rp_admin_media_update', 'role_admin_001', 'perm_media_update', NOW()),
('rp_admin_media_delete', 'role_admin_001', 'perm_media_delete', NOW()),
('rp_admin_settings_read', 'role_admin_001', 'perm_settings_read', NOW()),
('rp_admin_settings_update', 'role_admin_001', 'perm_settings_update', NOW());

-- Create admin user with bcrypt hashed password for "admin123"
-- Generated with: bcrypt.hash('admin123', 12)
INSERT INTO users (id, name, email, password, first_name, last_name, is_active, is_verified, timezone, locale, role, created_at, updated_at) VALUES
('user_admin_001', 'System Administrator', 'admin@liveyourdreams.online', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMst.a7WUl31ZLu', 'System', 'Administrator', true, true, 'Europe/Berlin', 'de', 'admin', NOW(), NOW());

-- Assign admin role to admin user
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by) VALUES
('ur_admin_001', 'user_admin_001', 'role_admin_001', NOW(), 'user_admin_001');

-- Create categories
INSERT INTO categories (id, name, slug, description, color, is_active, sort_order, created_at, updated_at) VALUES
('cat_immobilien_001', 'Immobilien', 'immobilien', 'Artikel über Immobilien und Investitionen', '#3b82f6', true, 1, NOW(), NOW()),
('cat_lifestyle_001', 'Lifestyle', 'lifestyle', 'Lifestyle und persönliche Entwicklung', '#10b981', true, 2, NOW(), NOW()),
('cat_business_001', 'Business', 'business', 'Business und Unternehmertum', '#f59e0b', true, 3, NOW(), NOW()),
('cat_technologie_001', 'Technologie', 'technologie', 'Technologie und Innovation', '#8b5cf6', true, 4, NOW(), NOW());

-- Create tags
INSERT INTO tags (id, name, slug, created_at) VALUES
('tag_investment_001', 'Investment', 'investment', NOW()),
('tag_marketing_001', 'Marketing', 'marketing', NOW()),
('tag_seo_001', 'SEO', 'seo', NOW()),
('tag_design_001', 'Design', 'design', NOW()),
('tag_development_001', 'Development', 'development', NOW()),
('tag_analytics_001', 'Analytics', 'analytics', NOW());

-- Create demo blog post
INSERT INTO posts (id, title, slug, excerpt, content, status, published_at, author_id, created_at, updated_at) VALUES
('post_welcome_001', 'Willkommen im LYD Backoffice', 'willkommen-im-lyd-backoffice', 'Das neue LYD Backoffice mit PostgreSQL und Design System Integration.', 
'<h1>Willkommen!</h1><p>Das LYD Backoffice wurde erfolgreich auf PostgreSQL migriert und nutzt nun unser professionelles Design System.</p><h2>Features:</h2><ul><li>PostgreSQL Database</li><li>Role-based Authentication</li><li>Media Management (coming soon)</li><li>Professional UI/UX</li></ul>', 
'published', NOW(), 'user_admin_001', NOW(), NOW());

-- Link demo post to categories
INSERT INTO post_categories (id, post_id, category_id, created_at) VALUES
('pc_welcome_001', 'post_welcome_001', 'cat_technologie_001', NOW());

-- Link demo post to tags  
INSERT INTO post_tags (id, post_id, tag_id, created_at) VALUES
('pt_welcome_dev_001', 'post_welcome_001', 'tag_development_001', NOW()),
('pt_welcome_design_001', 'post_welcome_001', 'tag_design_001', NOW());
