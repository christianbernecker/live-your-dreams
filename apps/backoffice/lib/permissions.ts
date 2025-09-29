/**
 * Permission Enforcement System
 * 
 * Provides server-side permission checking and enforcement for the RBAC system.
 * All API routes and server actions should use these functions to ensure proper access control.
 */

import type { Session } from 'next-auth';
import { prisma } from './db';
import type { PermissionKey } from './rbac';

// ============================================================================
// PERMISSION CHECKING
// ============================================================================

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
  session: Session | null,
  permissionKey: PermissionKey
): Promise<boolean> {
  if (!session?.user?.id) {
    return false;
  }

  try {
    // Get user with all roles and their permissions
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return false;
    }

    // Collect all permissions from all roles
    const userPermissions = new Set<string>();
    
    for (const userRole of user.roles) {
      if (userRole.role.isActive) {
        for (const rolePermission of userRole.role.permissions) {
          userPermissions.add(rolePermission.permission.name);
        }
      }
    }

    return userPermissions.has(permissionKey);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check if user has ANY of the provided permissions
 */
export async function hasAnyPermission(
  session: Session | null,
  permissionKeys: PermissionKey[]
): Promise<boolean> {
  if (permissionKeys.length === 0) return true;
  
  for (const key of permissionKeys) {
    if (await hasPermission(session, key)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if user has ALL of the provided permissions
 */
export async function hasAllPermissions(
  session: Session | null,
  permissionKeys: PermissionKey[]
): Promise<boolean> {
  for (const key of permissionKeys) {
    if (!(await hasPermission(session, key))) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !user.isActive) {
      return [];
    }

    const userPermissions = new Set<string>();
    
    for (const userRole of user.roles) {
      if (userRole.role.isActive) {
        for (const rolePermission of userRole.role.permissions) {
          userPermissions.add(rolePermission.permission.name);
        }
      }
    }

    return Array.from(userPermissions).sort();
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

// ============================================================================
// PERMISSION ENFORCEMENT (Throws on failure)
// ============================================================================

/**
 * Enforce that a user has a specific permission
 * Throws Response(403) if permission is denied
 */
export async function enforcePermission(
  session: Session | null,
  permissionKey: PermissionKey
): Promise<void> {
  const hasAccess = await hasPermission(session, permissionKey);
  
  if (!hasAccess) {
    throw new Response(`Forbidden: Missing permission '${permissionKey}'`, { 
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Enforce that a user has ANY of the provided permissions
 */
export async function enforceAnyPermission(
  session: Session | null,
  permissionKeys: PermissionKey[]
): Promise<void> {
  const hasAccess = await hasAnyPermission(session, permissionKeys);
  
  if (!hasAccess) {
    throw new Response(`Forbidden: Missing any of permissions [${permissionKeys.join(', ')}]`, { 
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Enforce that a user has ALL of the provided permissions
 */
export async function enforceAllPermissions(
  session: Session | null,
  permissionKeys: PermissionKey[]
): Promise<void> {
  const hasAccess = await hasAllPermissions(session, permissionKeys);
  
  if (!hasAccess) {
    throw new Response(`Forbidden: Missing required permissions [${permissionKeys.join(', ')}]`, { 
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// ============================================================================
// USER SESSION HELPERS
// ============================================================================

/**
 * Get current user with roles (for server components)
 */
export async function getCurrentUserWithRoles(session: Session | null) {
  if (!session?.user?.id) {
    return null;
  }

  try {
    return await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user is active and verified
 */
export async function isUserActive(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true, isVerified: true }
    });
    
    return user?.isActive === true;
  } catch (error) {
    console.error('Error checking if user is active:', error);
    return false;
  }
}

/**
 * Check if user has admin privileges
 */
export async function isAdmin(session: Session | null): Promise<boolean> {
  return await hasPermission(session, 'settings.system');
}

/**
 * Check if user can manage other users
 */
export async function canManageUsers(session: Session | null): Promise<boolean> {
  return await hasAnyPermission(session, ['users.write', 'users.invite', 'roles.assign']);
}

/**
 * Check if user can publish content
 */
export async function canPublishContent(session: Session | null): Promise<boolean> {
  return await hasAnyPermission(session, ['posts.publish', 'content.publish']);
}

// ============================================================================
// RESOURCE OWNERSHIP CHECKS
// ============================================================================

/**
 * Check if user owns or can modify a specific post
 */
export async function canModifyPost(
  session: Session | null, 
  postId: string
): Promise<boolean> {
  if (!session?.user?.id) return false;

  // Admins and editors can modify any post
  if (await hasAnyPermission(session, ['posts.write', 'settings.system'])) {
    return true;
  }

  // Authors can modify their own posts
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });
    
    return post?.authorId === session.user.id;
  } catch (error) {
    console.error('Error checking post ownership:', error);
    return false;
  }
}

/**
 * Check if user owns or can modify a specific content entry
 */
export async function canModifyContent(
  session: Session | null, 
  contentId: string
): Promise<boolean> {
  if (!session?.user?.id) return false;

  // Admins and editors can modify any content
  if (await hasAnyPermission(session, ['content.write', 'settings.system'])) {
    return true;
  }

  // Authors can modify their own content
  try {
    const content = await prisma.contentEntry.findUnique({
      where: { id: contentId },
      select: { authorId: true }
    });
    
    return content?.authorId === session.user.id;
  } catch (error) {
    console.error('Error checking content ownership:', error);
    return false;
  }
}