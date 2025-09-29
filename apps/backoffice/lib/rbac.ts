/**
 * RBAC (Role-Based Access Control) System
 * 
 * Defines permission keys and role presets for the Live Your Dreams Backoffice.
 * This module provides type-safe permission keys and default role configurations.
 */

// ============================================================================
// PERMISSION KEYS (Type-Safe)
// ============================================================================

export type PermissionKey =
  // User Management
  | 'users.read' 
  | 'users.write' 
  | 'users.invite' 
  | 'users.delete'
  | 'users.impersonate'
  
  // Role Management
  | 'roles.read' 
  | 'roles.write'
  | 'roles.assign'
  
  // Content Management - Posts
  | 'posts.read' 
  | 'posts.write' 
  | 'posts.review' 
  | 'posts.publish'
  | 'posts.delete' 
  | 'posts.restore'
  
  // Content Management - Generic Content
  | 'content.read' 
  | 'content.write' 
  | 'content.review' 
  | 'content.publish'
  | 'content.delete' 
  | 'content.restore'
  | 'content.types.manage'
  
  // Media Management
  | 'media.read'
  | 'media.upload'
  | 'media.edit'
  | 'media.delete'
  | 'media.organize'
  
  // System Settings
  | 'settings.read' 
  | 'settings.write'
  | 'settings.system'
  
  // Analytics & Auditing
  | 'analytics.read'
  | 'audit.read'
  | 'audit.export';

// ============================================================================
// ROLE PRESETS
// ============================================================================

export const ROLE_PRESETS: Record<string, PermissionKey[]> = {
  // Super Administrator - Full Access
  admin: [
    'users.read', 'users.write', 'users.invite', 'users.delete', 'users.impersonate',
    'roles.read', 'roles.write', 'roles.assign',
    'posts.read', 'posts.write', 'posts.review', 'posts.publish', 'posts.delete', 'posts.restore',
    'content.read', 'content.write', 'content.review', 'content.publish', 'content.delete', 'content.restore', 'content.types.manage',
    'media.read', 'media.upload', 'media.edit', 'media.delete', 'media.organize',
    'settings.read', 'settings.write', 'settings.system',
    'analytics.read', 'audit.read', 'audit.export'
  ],
  
  // Content Editor - Full content management
  editor: [
    'posts.read', 'posts.write', 'posts.review', 'posts.publish', 'posts.delete',
    'content.read', 'content.write', 'content.review', 'content.publish', 'content.delete',
    'media.read', 'media.upload', 'media.edit', 'media.delete', 'media.organize',
    'analytics.read'
  ],
  
  // Content Reviewer - Review and approve content
  reviewer: [
    'posts.read', 'posts.review', 'posts.publish',
    'content.read', 'content.review', 'content.publish',
    'media.read', 'media.organize'
  ],
  
  // Author - Create and edit own content
  author: [
    'posts.read', 'posts.write',
    'content.read', 'content.write',
    'media.read', 'media.upload', 'media.edit'
  ],
  
  // Viewer - Read-only access
  viewer: [
    'posts.read',
    'content.read',
    'media.read'
  ]
};

// ============================================================================
// PERMISSION METADATA
// ============================================================================

export interface PermissionInfo {
  key: PermissionKey;
  module: string;
  action: string;
  displayName: string;
  description: string;
}

export const PERMISSION_INFO: Record<PermissionKey, PermissionInfo> = {
  // Users
  'users.read': {
    key: 'users.read',
    module: 'users',
    action: 'read',
    displayName: 'Benutzer anzeigen',
    description: 'Kann Benutzerlisten und -profile einsehen'
  },
  'users.write': {
    key: 'users.write',
    module: 'users',
    action: 'write',
    displayName: 'Benutzer bearbeiten',
    description: 'Kann Benutzerprofile erstellen und bearbeiten'
  },
  'users.invite': {
    key: 'users.invite',
    module: 'users',
    action: 'invite',
    displayName: 'Benutzer einladen',
    description: 'Kann neue Benutzer zum System einladen'
  },
  'users.delete': {
    key: 'users.delete',
    module: 'users',
    action: 'delete',
    displayName: 'Benutzer löschen',
    description: 'Kann Benutzerkonten deaktivieren oder löschen'
  },
  'users.impersonate': {
    key: 'users.impersonate',
    module: 'users',
    action: 'impersonate',
    displayName: 'Als Benutzer agieren',
    description: 'Kann sich als anderer Benutzer anmelden (Support)'
  },

  // Roles
  'roles.read': {
    key: 'roles.read',
    module: 'roles',
    action: 'read',
    displayName: 'Rollen anzeigen',
    description: 'Kann Rollen und Berechtigungen einsehen'
  },
  'roles.write': {
    key: 'roles.write',
    module: 'roles',
    action: 'write',
    displayName: 'Rollen verwalten',
    description: 'Kann Rollen erstellen, bearbeiten und Berechtigungen zuweisen'
  },
  'roles.assign': {
    key: 'roles.assign',
    module: 'roles',
    action: 'assign',
    displayName: 'Rollen zuweisen',
    description: 'Kann Benutzern Rollen zuweisen oder entziehen'
  },

  // Posts
  'posts.read': {
    key: 'posts.read',
    module: 'posts',
    action: 'read',
    displayName: 'Posts anzeigen',
    description: 'Kann Blog-Posts und Artikel einsehen'
  },
  'posts.write': {
    key: 'posts.write',
    module: 'posts',
    action: 'write',
    displayName: 'Posts bearbeiten',
    description: 'Kann Blog-Posts erstellen und bearbeiten'
  },
  'posts.review': {
    key: 'posts.review',
    module: 'posts',
    action: 'review',
    displayName: 'Posts prüfen',
    description: 'Kann Posts zur Überprüfung freigeben oder ablehnen'
  },
  'posts.publish': {
    key: 'posts.publish',
    module: 'posts',
    action: 'publish',
    displayName: 'Posts veröffentlichen',
    description: 'Kann geprüfte Posts veröffentlichen'
  },
  'posts.delete': {
    key: 'posts.delete',
    module: 'posts',
    action: 'delete',
    displayName: 'Posts löschen',
    description: 'Kann Posts in den Papierkorb verschieben'
  },
  'posts.restore': {
    key: 'posts.restore',
    module: 'posts',
    action: 'restore',
    displayName: 'Posts wiederherstellen',
    description: 'Kann gelöschte Posts wiederherstellen'
  },

  // Content
  'content.read': {
    key: 'content.read',
    module: 'content',
    action: 'read',
    displayName: 'Inhalte anzeigen',
    description: 'Kann alle Inhaltstypen einsehen'
  },
  'content.write': {
    key: 'content.write',
    module: 'content',
    action: 'write',
    displayName: 'Inhalte bearbeiten',
    description: 'Kann Inhalte erstellen und bearbeiten'
  },
  'content.review': {
    key: 'content.review',
    module: 'content',
    action: 'review',
    displayName: 'Inhalte prüfen',
    description: 'Kann Inhalte zur Überprüfung freigeben oder ablehnen'
  },
  'content.publish': {
    key: 'content.publish',
    module: 'content',
    action: 'publish',
    displayName: 'Inhalte veröffentlichen',
    description: 'Kann geprüfte Inhalte veröffentlichen'
  },
  'content.delete': {
    key: 'content.delete',
    module: 'content',
    action: 'delete',
    displayName: 'Inhalte löschen',
    description: 'Kann Inhalte in den Papierkorb verschieben'
  },
  'content.restore': {
    key: 'content.restore',
    module: 'content',
    action: 'restore',
    displayName: 'Inhalte wiederherstellen',
    description: 'Kann gelöschte Inhalte wiederherstellen'
  },
  'content.types.manage': {
    key: 'content.types.manage',
    module: 'content',
    action: 'types.manage',
    displayName: 'Content-Typen verwalten',
    description: 'Kann neue Content-Typen erstellen und konfigurieren'
  },

  // Media
  'media.read': {
    key: 'media.read',
    module: 'media',
    action: 'read',
    displayName: 'Medien anzeigen',
    description: 'Kann Medien-Bibliothek einsehen'
  },
  'media.upload': {
    key: 'media.upload',
    module: 'media',
    action: 'upload',
    displayName: 'Medien hochladen',
    description: 'Kann Bilder, Videos und Dateien hochladen'
  },
  'media.edit': {
    key: 'media.edit',
    module: 'media',
    action: 'edit',
    displayName: 'Medien bearbeiten',
    description: 'Kann Medien-Metadaten bearbeiten'
  },
  'media.delete': {
    key: 'media.delete',
    module: 'media',
    action: 'delete',
    displayName: 'Medien löschen',
    description: 'Kann Medien aus der Bibliothek entfernen'
  },
  'media.organize': {
    key: 'media.organize',
    module: 'media',
    action: 'organize',
    displayName: 'Medien organisieren',
    description: 'Kann Ordner erstellen und Medien organisieren'
  },

  // Settings
  'settings.read': {
    key: 'settings.read',
    module: 'settings',
    action: 'read',
    displayName: 'Einstellungen anzeigen',
    description: 'Kann System-Einstellungen einsehen'
  },
  'settings.write': {
    key: 'settings.write',
    module: 'settings',
    action: 'write',
    displayName: 'Einstellungen ändern',
    description: 'Kann System-Einstellungen bearbeiten'
  },
  'settings.system': {
    key: 'settings.system',
    module: 'settings',
    action: 'system',
    displayName: 'System-Einstellungen',
    description: 'Kann kritische System-Einstellungen ändern'
  },

  // Analytics & Audit
  'analytics.read': {
    key: 'analytics.read',
    module: 'analytics',
    action: 'read',
    displayName: 'Analytics anzeigen',
    description: 'Kann Analytics und Statistiken einsehen'
  },
  'audit.read': {
    key: 'audit.read',
    module: 'audit',
    action: 'read',
    displayName: 'Audit-Log anzeigen',
    description: 'Kann Audit-Protokolle einsehen'
  },
  'audit.export': {
    key: 'audit.export',
    module: 'audit',
    action: 'export',
    displayName: 'Audit-Log exportieren',
    description: 'Kann Audit-Protokolle exportieren'
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get all permissions for a given module
 */
export function getPermissionsByModule(module: string): PermissionInfo[] {
  return Object.values(PERMISSION_INFO).filter(p => p.module === module);
}

/**
 * Get all available modules
 */
export function getAvailableModules(): string[] {
  const modules = new Set(Object.values(PERMISSION_INFO).map(p => p.module));
  return Array.from(modules).sort();
}

/**
 * Check if a permission key is valid
 */
export function isValidPermission(key: string): key is PermissionKey {
  return key in PERMISSION_INFO;
}

