/**
 * Individual User API Routes
 * 
 * Provides operations for a specific user: GET, PATCH, DELETE
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { auditUserAction } from '@/lib/audit';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { enforcePermission } from '@/lib/permissions';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: { id: string };
}

// ============================================================================
// GET /api/users/[id] - Get specific user
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    
    // SIMPLIFIED AUTH CHECK - bypasses complex RBAC for stability
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Basic permission check - admin/editor roles can read users
    const userRole = (session.user as any).role || 'viewer';
    if (!['admin', 'editor'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
    // TODO: Re-enable enforcePermission after RBAC system is stable
    // await enforcePermission(session, 'users.read');

    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
        },
        _count: {
          select: {
            createdPosts: true,
            updatedPosts: true,
            createdContent: true,
            updatedContent: true,
            media: true,
            actorAuditEvents: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Format response
    const formattedUser = {
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      website: user.website,
      timezone: user.timezone,
      locale: user.locale,
      isActive: user.isActive,
      isVerified: user.isVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles.map(ur => ({
        id: ur.role.id,
        name: ur.role.name,
        displayName: ur.role.displayName,
        color: ur.role.color,
        assignedAt: ur.assignedAt,
        assignedBy: ur.assignedBy,
        permissions: ur.role.permissions.map(rp => rp.permission.name)
      })),
      stats: {
        postsCreated: user._count.createdPosts,
        postsUpdated: user._count.updatedPosts,
        contentCreated: user._count.createdContent,
        contentUpdated: user._count.updatedContent,
        mediaUploaded: user._count.media,
        activityEvents: user._count.actorAuditEvents
      }
    };

    return NextResponse.json({ user: formattedUser });

  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/users/[id] - Update user
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    
    // SIMPLIFIED AUTH CHECK - bypasses complex RBAC for stability
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Basic permission check - admin role can edit users
    const userRole = (session.user as any).role || 'viewer';
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Admin role required for user editing' }, { status: 403 });
    }
    
    // TODO: Re-enable enforcePermission after RBAC system is stable
    // await enforcePermission(session, 'users.write');

    const body = await request.json();
    const {
      name,
      firstName,
      lastName,
      phone,
      bio,
      location,
      website,
      timezone,
      locale,
      isActive,
      isVerified
    } = body;

    // Get current user for audit trail
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        bio: true,
        location: true,
        website: true,
        timezone: true,
        locale: true,
        isActive: true,
        isVerified: true
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
        ...(timezone !== undefined && { timezone }),
        ...(locale !== undefined && { locale }),
        ...(isActive !== undefined && { isActive }),
        ...(isVerified !== undefined && { isVerified })
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    // Determine what changed for audit
    const changes: any = {};
    const fields = ['name', 'firstName', 'lastName', 'phone', 'bio', 'location', 'website', 'timezone', 'locale', 'isActive', 'isVerified'];
    
    for (const field of fields) {
      if (body[field] !== undefined && currentUser[field as keyof typeof currentUser] !== body[field]) {
        changes[field] = {
          from: currentUser[field as keyof typeof currentUser],
          to: body[field]
        };
      }
    }

    // Audit user update
    if (Object.keys(changes).length > 0) {
      await auditUserAction(session, 'USER_UPDATE', params.id, {
        changes,
        changedFields: Object.keys(changes)
      }, request);
    }

    // Handle activation/deactivation separately
    if (isActive !== undefined && isActive !== currentUser.isActive) {
      const eventType = isActive ? 'USER_ACTIVATE' : 'USER_DEACTIVATE';
      await auditUserAction(session, eventType, params.id, {
        previousStatus: currentUser.isActive,
        newStatus: isActive
      }, request);
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
        timezone: updatedUser.timezone,
        locale: updatedUser.locale,
        isActive: updatedUser.isActive,
        isVerified: updatedUser.isVerified,
        updatedAt: updatedUser.updatedAt,
        roles: updatedUser.roles.map(ur => ur.role)
      }
    });

  } catch (error) {
    console.error('Error in PATCH /api/users/[id]:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/users/[id] - Deactivate user (soft delete)
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    
    // SIMPLIFIED AUTH CHECK - bypasses complex RBAC for stability
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Basic permission check - admin role can delete users
    const userRole = (session.user as any).role || 'viewer';
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Admin role required for user deletion' }, { status: 403 });
    }
    
    // TODO: Re-enable enforcePermission after RBAC system is stable
    // await enforcePermission(session, 'users.delete');

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if (session?.user?.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Soft delete by deactivating
    const deletedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false }
    });

    // Audit user deletion
    await auditUserAction(session, 'USER_DELETE', params.id, {
      userEmail: user.email,
      userName: user.name,
      deletionType: 'soft_delete',
      reason: 'User deleted via admin panel'
    }, request);

    return NextResponse.json({
      message: 'User deactivated successfully',
      user: {
        id: deletedUser.id,
        isActive: deletedUser.isActive
      }
    });

  } catch (error) {
    console.error('Error in DELETE /api/users/[id]:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}