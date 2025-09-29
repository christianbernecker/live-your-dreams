/**
 * Debug API - Check User Roles
 * 
 * Temporary endpoint to debug user role assignments
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || 'admin@liveyourdreams.online';

    // Get user with all role information
    const user = await prisma.user.findUnique({
      where: { email },
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

    if (!user) {
      return NextResponse.json({
        error: 'User not found',
        email,
        suggestion: 'Create user first'
      });
    }

    // Collect all permissions
    const allPermissions = [];
    for (const userRole of user.roles) {
      for (const rolePermission of userRole.role.permissions) {
        allPermissions.push(rolePermission.permission.name);
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        legacyRole: user.role, // Old role field
      },
      roles: user.roles.map(ur => ({
        roleName: ur.role.name,
        roleDisplayName: ur.role.displayName,
        assignedAt: ur.assignedAt,
        permissionCount: ur.role.permissions.length
      })),
      permissions: allPermissions,
      hasAdminPermissions: allPermissions.includes('users.read'),
      canAccessAdmin: allPermissions.includes('users.read') || allPermissions.includes('settings.read'),
      debug: {
        totalRoles: user.roles.length,
        totalPermissions: allPermissions.length,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Debug user roles error:', error);
    return NextResponse.json({
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

