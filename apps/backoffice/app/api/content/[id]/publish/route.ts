/**
 * Content Publishing API
 * 
 * Handles content publishing workflow
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
// POST /api/content/[id]/publish - Publish content entry
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    await enforcePermission(session, 'content.publish');

    const body = await request.json();
    const { publishedAt, reason } = body;

    // Get current entry
    const currentEntry = await prisma.contentEntry.findUnique({
      where: { id: params.id },
      include: {
        type: true,
        author: {
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

    // Check if already published
    if (currentEntry.status === 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Content is already published' },
        { status: 400 }
      );
    }

    // Check if content is ready for publishing (not draft)
    if (currentEntry.status === 'DRAFT') {
      return NextResponse.json(
        { error: 'Content must be reviewed before publishing' },
        { status: 400 }
      );
    }

    // Publish content
    const publishDate = publishedAt ? new Date(publishedAt) : new Date();
    
    const publishedEntry = await prisma.contentEntry.update({
      where: { id: params.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: publishDate,
        updatedById: session?.user?.id
      },
      include: {
        type: true,
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Audit publishing
    await auditContentAction(session, 'CONTENT_PUBLISH', params.id, 'content', {
      contentType: currentEntry.type.key,
      contentTitle: currentEntry.title,
      previousStatus: currentEntry.status,
      newStatus: 'PUBLISHED',
      publishedAt: publishDate,
      reason: reason || 'Published via admin panel'
    }, request);

    return NextResponse.json({
      entry: {
        id: publishedEntry.id,
        title: publishedEntry.title,
        slug: publishedEntry.slug,
        status: publishedEntry.status,
        publishedAt: publishedEntry.publishedAt,
        updatedAt: publishedEntry.updatedAt
      },
      message: 'Content published successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/content/[id]/publish:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to publish content' },
      { status: 500 }
    );
  }
}

