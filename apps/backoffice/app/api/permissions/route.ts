/**
 * Permissions API Routes
 * 
 * Provides read-only access to available permissions for role management UI
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { enforcePermission } from '@/lib/permissions';
import { getAvailableModules } from '@/lib/rbac';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// GET /api/permissions - List all permissions grouped by module
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    await enforcePermission(session, 'roles.read');

    const url = new URL(request.url);
    const moduleFilter = url.searchParams.get('module');
    const includeUsage = url.searchParams.get('includeUsage') === 'true';

    // Build where clause
    const where: any = {};
    if (moduleFilter) {
      where.module = moduleFilter;
    }

    // Get permissions from database
    const permissions = await prisma.permission.findMany({
      where,
      include: {
        roles: includeUsage ? {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                displayName: true,
                isActive: true
              }
            }
          }
        } : { select: { id: true } },
        _count: {
          select: {
            roles: true
          }
        }
      },
      orderBy: [
        { module: 'asc' },
        { action: 'asc' },
        { name: 'asc' }
      ]
    });

    // Group by module
    const permissionsByModule: Record<string, any[]> = {};
    
    for (const permission of permissions) {
      const moduleKey = permission.module;
      
      if (!permissionsByModule[moduleKey]) {
        permissionsByModule[moduleKey] = [];
      }
      
      const permissionData = {
        id: permission.id,
        name: permission.name,
        displayName: permission.displayName,
        description: permission.description,
        module: permission.module,
        action: permission.action,
        roleCount: permission._count.roles,
        ...(includeUsage && {
          roles: permission.roles.map(rp => (rp as any).role).filter((r: any) => r?.isActive)
        })
      };
      
      permissionsByModule[moduleKey].push(permissionData);
    }

    // Get available modules
    const modules = getAvailableModules();
    
    // Ensure all modules are present (even if empty)
    for (const moduleKey of modules) {
      if (!permissionsByModule[moduleKey]) {
        permissionsByModule[moduleKey] = [];
      }
    }

    return NextResponse.json({
      permissions: permissionsByModule,
      modules,
      total: permissions.length
    });

  } catch (error) {
    console.error('Error in GET /api/permissions:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
