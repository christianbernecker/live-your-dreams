import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Permission {
  id: string
  name: string
  displayName: string
  description: string
  category: string
}

export interface Role {
  id: string
  name: string
  displayName: string
  description: string
  color: string
  permissions: Permission[]
}

export interface UserWithPermissions {
  id: string
  email: string
  name: string | null
  role: string
  roles: Role[]
  permissions: string[]
}

/**
 * Get user with all roles and permissions
 */
export async function getUserWithPermissions(userId: string): Promise<UserWithPermissions | null> {
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
    })

    if (!user) return null

    const roles: Role[] = user.roles.map(userRole => ({
      id: userRole.role.id,
      name: userRole.role.name,
      displayName: userRole.role.displayName,
      description: userRole.role.description,
      color: userRole.role.color,
      permissions: userRole.role.permissions.map(rp => ({
        id: rp.permission.id,
        name: rp.permission.name,
        displayName: rp.permission.displayName,
        description: rp.permission.description,
        category: rp.permission.category || 'General'
      }))
    }))

    // Collect all unique permissions
    const permissions = Array.from(new Set(
      roles.flatMap(role => role.permissions.map(p => p.name))
    ))

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      roles,
      permissions
    }
  } catch (error) {
    console.error('Error fetching user permissions:', error)
    return null
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(userId: string, permission: string): Promise<boolean> {
  try {
    const user = await getUserWithPermissions(userId)
    return user?.permissions.includes(permission) || false
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

/**
 * Check if user has admin role
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    return user?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * Require permission middleware for API routes
 */
export function requirePermission(permission: string) {
  return async (userId: string) => {
    const hasRequiredPermission = await hasPermission(userId, permission)
    if (!hasRequiredPermission) {
      throw new Error(`Permission required: ${permission}`)
    }
    return true
  }
}

/**
 * Require admin middleware for API routes
 */
export function requireAdmin() {
  return async (userId: string) => {
    const userIsAdmin = await isAdmin(userId)
    if (!userIsAdmin) {
      throw new Error('Admin access required')
    }
    return true
  }
}

/**
 * Available permissions in the system
 */
export const AVAILABLE_PERMISSIONS = {
  // User Management
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  
  // Role Management
  ROLES_CREATE: 'roles:create',
  ROLES_READ: 'roles:read',
  ROLES_UPDATE: 'roles:update',
  ROLES_DELETE: 'roles:delete',
  
  // Content Management
  POSTS_CREATE: 'posts:create',
  POSTS_READ: 'posts:read',
  POSTS_UPDATE: 'posts:update',
  POSTS_DELETE: 'posts:delete',
  POSTS_PUBLISH: 'posts:publish',
  
  // Media Management
  MEDIA_CREATE: 'media:create',
  MEDIA_READ: 'media:read',
  MEDIA_UPDATE: 'media:update',
  MEDIA_DELETE: 'media:delete',
  
  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
} as const

export type PermissionKey = keyof typeof AVAILABLE_PERMISSIONS
export type PermissionValue = typeof AVAILABLE_PERMISSIONS[PermissionKey]
