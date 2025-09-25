-- ============================================================================
-- LYD BACKOFFICE - DATABASE SEED
-- ============================================================================

-- Insert Roles
INSERT INTO roles (id, name, display_name, description, color, is_active, created_at, updated_at) VALUES
('role_admin_001', 'admin', 'Administrator', 'Full system access with all permissions', '#dc2626', 1, datetime('now'), datetime('now')),
('role_editor_001', 'editor', 'Editor', 'Content management and editing permissions', '#2563eb', 1, datetime('now'), datetime('now')),
('role_viewer_001', 'viewer', 'Viewer', 'Read-only access to content', '#16a34a', 1, datetime('now'), datetime('now'));

-- Insert Permissions
INSERT INTO permissions (id, name, display_name, description, module, action, created_at) VALUES
-- User Management
('perm_users_create', 'users.create', 'Create Users', 'Create new user accounts', 'users', 'create', datetime('now')),
('perm_users_read', 'users.read', 'View Users', 'View user profiles and lists', 'users', 'read', datetime('now')),
('perm_users_update', 'users.update', 'Update Users', 'Edit user profiles and settings', 'users', 'update', datetime('now')),
('perm_users_delete', 'users.delete', 'Delete Users', 'Remove user accounts', 'users', 'delete', datetime('now')),

-- Post Management
('perm_posts_create', 'posts.create', 'Create Posts', 'Create new blog posts', 'posts', 'create', datetime('now')),
('perm_posts_read', 'posts.read', 'View Posts', 'View posts and drafts', 'posts', 'read', datetime('now')),
('perm_posts_update', 'posts.update', 'Update Posts', 'Edit posts and content', 'posts', 'update', datetime('now')),
('perm_posts_delete', 'posts.delete', 'Delete Posts', 'Remove posts', 'posts', 'delete', datetime('now')),
('perm_posts_publish', 'posts.publish', 'Publish Posts', 'Publish and unpublish posts', 'posts', 'publish', datetime('now')),

-- Media Management
('perm_media_upload', 'media.upload', 'Upload Media', 'Upload files and images', 'media', 'create', datetime('now')),
('perm_media_read', 'media.read', 'View Media', 'View media library', 'media', 'read', datetime('now')),
('perm_media_update', 'media.update', 'Update Media', 'Edit media metadata', 'media', 'update', datetime('now')),
('perm_media_delete', 'media.delete', 'Delete Media', 'Remove media files', 'media', 'delete', datetime('now')),

-- Settings
('perm_settings_read', 'settings.read', 'View Settings', 'View system settings', 'settings', 'read', datetime('now')),
('perm_settings_update', 'settings.update', 'Update Settings', 'Change system settings', 'settings', 'update', datetime('now'));

-- Admin gets ALL permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at) VALUES
('rp_admin_users_create', 'role_admin_001', 'perm_users_create', datetime('now')),
('rp_admin_users_read', 'role_admin_001', 'perm_users_read', datetime('now')),
('rp_admin_users_update', 'role_admin_001', 'perm_users_update', datetime('now')),
('rp_admin_users_delete', 'role_admin_001', 'perm_users_delete', datetime('now')),
('rp_admin_posts_create', 'role_admin_001', 'perm_posts_create', datetime('now')),
('rp_admin_posts_read', 'role_admin_001', 'perm_posts_read', datetime('now')),
('rp_admin_posts_update', 'role_admin_001', 'perm_posts_update', datetime('now')),
('rp_admin_posts_delete', 'role_admin_001', 'perm_posts_delete', datetime('now')),
('rp_admin_posts_publish', 'role_admin_001', 'perm_posts_publish', datetime('now')),
('rp_admin_media_upload', 'role_admin_001', 'perm_media_upload', datetime('now')),
('rp_admin_media_read', 'role_admin_001', 'perm_media_read', datetime('now')),
('rp_admin_media_update', 'role_admin_001', 'perm_media_update', datetime('now')),
('rp_admin_media_delete', 'role_admin_001', 'perm_media_delete', datetime('now')),
('rp_admin_settings_read', 'role_admin_001', 'perm_settings_read', datetime('now')),
('rp_admin_settings_update', 'role_admin_001', 'perm_settings_update', datetime('now'));

-- Editor permissions (content + media + read access)
INSERT INTO role_permissions (id, role_id, permission_id, created_at) VALUES
('rp_editor_posts_create', 'role_editor_001', 'perm_posts_create', datetime('now')),
('rp_editor_posts_read', 'role_editor_001', 'perm_posts_read', datetime('now')),
('rp_editor_posts_update', 'role_editor_001', 'perm_posts_update', datetime('now')),
('rp_editor_posts_delete', 'role_editor_001', 'perm_posts_delete', datetime('now')),
('rp_editor_posts_publish', 'role_editor_001', 'perm_posts_publish', datetime('now')),
('rp_editor_media_upload', 'role_editor_001', 'perm_media_upload', datetime('now')),
('rp_editor_media_read', 'role_editor_001', 'perm_media_read', datetime('now')),
('rp_editor_media_update', 'role_editor_001', 'perm_media_update', datetime('now')),
('rp_editor_media_delete', 'role_editor_001', 'perm_media_delete', datetime('now')),
('rp_editor_users_read', 'role_editor_001', 'perm_users_read', datetime('now')),
('rp_editor_settings_read', 'role_editor_001', 'perm_settings_read', datetime('now'));

-- Viewer permissions (read-only)
INSERT INTO role_permissions (id, role_id, permission_id, created_at) VALUES
('rp_viewer_posts_read', 'role_viewer_001', 'perm_posts_read', datetime('now')),
('rp_viewer_media_read', 'role_viewer_001', 'perm_media_read', datetime('now')),
('rp_viewer_users_read', 'role_viewer_001', 'perm_users_read', datetime('now')),
('rp_viewer_settings_read', 'role_viewer_001', 'perm_settings_read', datetime('now'));

-- Create Admin User
INSERT INTO users (id, name, email, password, first_name, last_name, is_active, is_verified, timezone, locale, role, created_at, updated_at) VALUES
('user_admin_001', 'System Administrator', 'admin@liveyourdreams.online', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMst.a7WUl31ZLu', 'System', 'Administrator', 1, 1, 'Europe/Berlin', 'de', 'admin', datetime('now'), datetime('now'));

-- Assign admin role to admin user
INSERT INTO user_roles (id, user_id, role_id, assigned_at, assigned_by) VALUES
('ur_admin_001', 'user_admin_001', 'role_admin_001', datetime('now'), 'user_admin_001');

-- Create Categories
INSERT INTO categories (id, name, slug, description, color, is_active, sort_order, created_at, updated_at) VALUES
('cat_immobilien', 'Immobilien', 'immobilien', 'Alles rund um Immobilien und Investitionen', '#2563eb', 1, 1, datetime('now'), datetime('now')),
('cat_tipps', 'Tipps & Tricks', 'tipps-tricks', 'Hilfreiche Tipps für Immobilienerwerb', '#16a34a', 1, 2, datetime('now'), datetime('now')),
('cat_markt', 'Marktanalyse', 'marktanalyse', 'Aktuelle Marktentwicklungen und Analysen', '#dc2626', 1, 3, datetime('now'), datetime('now'));

-- Create Tags  
INSERT INTO tags (id, name, slug, color, created_at) VALUES
('tag_investment', 'Investment', 'investment', '#3b82f6', datetime('now')),
('tag_beratung', 'Beratung', 'beratung', '#10b981', datetime('now')),
('tag_finanzierung', 'Finanzierung', 'finanzierung', '#f59e0b', datetime('now')),
('tag_steuer', 'Steuer', 'steuer', '#ef4444', datetime('now')),
('tag_trends', 'Trends', 'trends', '#8b5cf6', datetime('now'));
