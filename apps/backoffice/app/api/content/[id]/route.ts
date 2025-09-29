/**
 * Individual Content Entry API Routes
 * 
 * Provides operations for specific content entries: GET, PATCH, DELETE
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { auditContentAction, createCrudMeta } from '@/lib/audit';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { canModifyContent, enforcePermission } from '@/lib/permissions';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: { id: string };
}

// ============================================================================
// GET /api/content/[id] - Get specific content entry
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    await enforcePermission(session, 'content.read');

    const entry = await prisma.contentEntry.findUnique({
      where: { id: params.id },
      include: {
        type: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        deletedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        auditEvents: {
          include: {
            actorUser: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Latest 10 audit events
        }
      }
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Content entry not found' },
        { status: 404 }
      );
    }

    // Check if user can access this content (authors can see their own drafts)
    const canAccess = await canModifyContent(session, entry.id) || 
                     entry.status === 'PUBLISHED' ||
                     (await enforcePermission(session, 'content.read'));

    if (!canAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ entry });

  } catch (error) {
    console.error('Error in GET /api/content/[id]:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch content entry' },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/content/[id] - Update content entry
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    
    // Get current entry for permission and audit checks
    const currentEntry = await prisma.contentEntry.findUnique({
      where: { id: params.id },
      include: { type: true }
    });

    if (!currentEntry) {
      return NextResponse.json(
        { error: 'Content entry not found' },
        { status: 404 }
      );
    }

    // Check permissions - either general content.write or ownership
    const canModify = await canModifyContent(session, params.id);
    if (!canModify) {
      await enforcePermission(session, 'content.write');
    }

    const body = await request.json();
    const {
      title,
      data,
      status,
      publishedAt
    } = body;

    // Validate status transition permissions
    if (status && status !== currentEntry.status) {
      if (status === 'PUBLISHED') {
        await enforcePermission(session, 'content.publish');
      } else if (status === 'REVIEW') {
        await enforcePermission(session, 'content.review');
      }
    }

    // Update entry
    const updatedEntry = await prisma.contentEntry.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(data && { data }),
        ...(status && { status }),
        ...(status === 'PUBLISHED' && publishedAt && { publishedAt: new Date(publishedAt) }),
        ...(status === 'PUBLISHED' && !publishedAt && !currentEntry.publishedAt && { publishedAt: new Date() }),
        updatedById: session?.user?.id
      },
      include: {
        type: true,
        author: {
          select: { id: true, name: true, email: true }
        },
        updatedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Audit content update
    const auditMeta = createCrudMeta('update', `${currentEntry.type.name}: ${currentEntry.title}`, {
      title: currentEntry.title,
      status: currentEntry.status,
      data: currentEntry.data
    }, {
      title: updatedEntry.title,
      status: updatedEntry.status,
      data: updatedEntry.data
    });

    await auditContentAction(session, 'CONTENT_UPDATE', params.id, 'content', auditMeta, request);

    // Special audit for status changes
    if (status && status !== currentEntry.status) {
      const statusEventMap = {
        'REVIEW': 'CONTENT_SUBMIT_REVIEW',
        'PUBLISHED': 'CONTENT_PUBLISH',
        'ARCHIVED': 'CONTENT_UNPUBLISH',
        'DRAFT': 'CONTENT_UNPUBLISH'
      } as const;

      const eventType = statusEventMap[status as keyof typeof statusEventMap];
      if (eventType) {
        await auditContentAction(session, eventType, params.id, 'content', {
          previousStatus: currentEntry.status,
          newStatus: status,
          contentTitle: updatedEntry.title
        }, request);
      }
    }

    return NextResponse.json({
      entry: {
        id: updatedEntry.id,
        title: updatedEntry.title,
        slug: updatedEntry.slug,
        data: updatedEntry.data,
        status: updatedEntry.status,
        publishedAt: updatedEntry.publishedAt,
        updatedAt: updatedEntry.updatedAt,
        type: updatedEntry.type,
        author: updatedEntry.author,
        updatedBy: updatedEntry.updatedBy
      }
    });

  } catch (error) {
    console.error('Error in PATCH /api/content/[id]:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to update content entry' },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/content/[id] - Soft delete content entry
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    
    // Get current entry
    const entry = await prisma.contentEntry.findUnique({
      where: { id: params.id },
      include: { type: true }
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Content entry not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const canModify = await canModifyContent(session, params.id);
    if (!canModify) {
      await enforcePermission(session, 'content.delete');
    }

    // Soft delete
    const deletedEntry = await prisma.contentEntry.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
        deletedById: session?.user?.id
      }
    });

    // Audit content deletion
    await auditContentAction(session, 'CONTENT_DELETE', params.id, 'content', {
      contentType: entry.type.key,
      contentTitle: entry.title,
      deletionType: 'soft_delete'
    }, request);

    return NextResponse.json({
      message: 'Content entry deleted successfully',
      entry: {
        id: deletedEntry.id,
        deletedAt: deletedEntry.deletedAt
      }
    });

  } catch (error) {
    console.error('Error in DELETE /api/content/[id]:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to delete content entry' },
      { status: 500 }
    );
  }
}

