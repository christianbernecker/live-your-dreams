/**
 * Content Restore API
 * 
 * Handles restoring soft-deleted content entries
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { auditContentAction } from '@/lib/audit';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { enforcePermission } from '@/lib/permissions';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: { id: string };
}

// ============================================================================
// POST /api/content/[id]/restore - Restore soft-deleted content
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    await enforcePermission(session, 'content.restore');

    const body = await request.json();
    const { reason } = body;

    // Get current entry (including deleted ones)
    const currentEntry = await prisma.contentEntry.findUnique({
      where: { id: params.id },
      include: {
        type: true,
        author: {
          select: { id: true, name: true, email: true }
        },
        deletedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!currentEntry) {
      return NextResponse.json(
        { error: 'Content entry not found' },
        { status: 404 }
      );
    }

    // Check if content is actually deleted
    if (!currentEntry.deletedAt) {
      return NextResponse.json(
        { error: 'Content is not deleted and cannot be restored' },
        { status: 400 }
      );
    }

    // Check for slug conflicts (another entry might use the slug now)
    const conflictingEntry = await prisma.contentEntry.findFirst({
      where: {
        slug: currentEntry.slug,
        deletedAt: null,
        id: { not: params.id }
      }
    });

    if (conflictingEntry) {
      return NextResponse.json(
        { 
          error: 'Cannot restore: Another content entry is using this slug',
          conflictingEntry: {
            id: conflictingEntry.id,
            title: conflictingEntry.title,
            slug: conflictingEntry.slug
          }
        },
        { status: 409 }
      );
    }

    // Restore content
    const restoredEntry = await prisma.contentEntry.update({
      where: { id: params.id },
      data: {
        deletedAt: null,
        deletedById: null,
        // Reset to draft when restoring
        status: 'DRAFT',
        updatedById: session?.user?.id
      },
      include: {
        type: true,
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Audit content restoration
    await auditContentAction(session, 'CONTENT_RESTORE', params.id, 'content', {
      contentType: currentEntry.type.key,
      contentTitle: currentEntry.title,
      previousStatus: 'DELETED',
      newStatus: 'DRAFT',
      deletedAt: currentEntry.deletedAt,
      deletedBy: currentEntry.deletedBy?.name,
      reason: reason || 'Restored via admin panel'
    }, request);

    return NextResponse.json({
      entry: {
        id: restoredEntry.id,
        title: restoredEntry.title,
        slug: restoredEntry.slug,
        status: restoredEntry.status,
        deletedAt: restoredEntry.deletedAt,
        updatedAt: restoredEntry.updatedAt,
        type: restoredEntry.type,
        author: restoredEntry.author
      },
      message: 'Content restored successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/content/[id]/restore:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to restore content' },
      { status: 500 }
    );
  }
}

