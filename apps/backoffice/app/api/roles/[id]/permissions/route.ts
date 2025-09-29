/**
 * Role Permissions API Routes
 * 
 * Manages permissions for a specific role
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { auditRoleAction } from '@/lib/audit';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { enforcePermission } from '@/lib/permissions';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: { id: string };
}

// ============================================================================
// PATCH /api/roles/[id]/permissions - Update role permissions
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    await enforcePermission(session, 'roles.write');

    const body = await request.json();
    const { permissionIds = [] } = body;

    // Validate role exists
    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Get current permission IDs
    const currentPermissionIds = role.permissions.map(rp => rp.permissionId);
    
    // Determine changes
    const toAdd = permissionIds.filter((id: string) => !currentPermissionIds.includes(id));
    const toRemove = currentPermissionIds.filter(id => !permissionIds.includes(id));

    // Validate new permissions exist
    if (toAdd.length > 0) {
      const validPermissions = await prisma.permission.findMany({
        where: { id: { in: toAdd } }
      });
      
      if (validPermissions.length !== toAdd.length) {
        return NextResponse.json(
          { error: 'One or more permissions not found' },
          { status: 400 }
        );
      }
    }

    // Update permissions in transaction
    const updatedRole = await prisma.$transaction(async (tx) => {
      // Remove old permissions
      if (toRemove.length > 0) {
        await tx.rolePermission.deleteMany({
          where: {
            roleId: params.id,
            permissionId: { in: toRemove }
          }
        });
      }

      // Add new permissions
      if (toAdd.length > 0) {
        await tx.rolePermission.createMany({
          data: toAdd.map((permissionId: string) => ({
            roleId: params.id,
            permissionId
          }))
        });
      }

      // Return updated role
      return await tx.role.findUnique({
        where: { id: params.id },
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      });
    });

    // Audit permission changes
    if (toAdd.length > 0) {
      const addedPermissions = await prisma.permission.findMany({
        where: { id: { in: toAdd } },
        select: { name: true }
      });
      
      await auditRoleAction(session, 'ROLE_PERMISSION_ADD', params.id, {
        roleName: role.name,
        addedPermissions: addedPermissions.map(p => p.name),
        count: toAdd.length
      }, request);
    }

    if (toRemove.length > 0) {
      const removedPermissions = role.permissions
        .filter(rp => toRemove.includes(rp.permissionId))
        .map(rp => rp.permission.name);
      
      await auditRoleAction(session, 'ROLE_PERMISSION_REMOVE', params.id, {
        roleName: role.name,
        removedPermissions,
        count: toRemove.length
      }, request);
    }

    return NextResponse.json({
      role: {
        id: updatedRole!.id,
        name: updatedRole!.name,
        displayName: updatedRole!.displayName,
        permissions: updatedRole!.permissions.map(rp => ({
          id: rp.permission.id,
          name: rp.permission.name,
          displayName: rp.permission.displayName,
          module: rp.permission.module,
          action: rp.permission.action
        }))
      },
      changes: {
        added: toAdd.length,
        removed: toRemove.length
      }
    });

  } catch (error) {
    console.error('Error in PATCH /api/roles/[id]/permissions:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to update role permissions' },
      { status: 500 }
    );
  }
}

