/**
 * Content Review API
 * 
 * Handles content review workflow (approve/reject)
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { auditContentAction, type AuditEventType } from '@/lib/audit';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { enforcePermission } from '@/lib/permissions';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: { id: string };
}

// ============================================================================
// POST /api/content/[id]/review - Submit for review or approve/reject
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    
    const body = await request.json();
    const { action, feedback, reason } = body; // action: 'submit' | 'approve' | 'reject'

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

    let updatedEntry;
    let auditType: AuditEventType;
    const auditMeta: any = {
      contentType: currentEntry.type.key,
      contentTitle: currentEntry.title,
      previousStatus: currentEntry.status,
      reason: reason || 'No reason provided'
    };

    switch (action) {
      case 'submit':
        // Submit for review - author can do this for their own content
        if (currentEntry.authorId !== session?.user?.id) {
          await enforcePermission(session, 'content.write');
        }
        
        if (currentEntry.status !== 'DRAFT') {
          return NextResponse.json(
            { error: 'Only draft content can be submitted for review' },
            { status: 400 }
          );
        }

        updatedEntry = await prisma.contentEntry.update({
          where: { id: params.id },
          data: {
            status: 'REVIEW',
            updatedById: session?.user?.id
          }
        });

        auditType = 'CONTENT_SUBMIT_REVIEW';
        auditMeta.newStatus = 'REVIEW';
        break;

      case 'approve':
        await enforcePermission(session, 'content.review');
        
        if (currentEntry.status !== 'REVIEW') {
          return NextResponse.json(
            { error: 'Only content in review can be approved' },
            { status: 400 }
          );
        }

        updatedEntry = await prisma.contentEntry.update({
          where: { id: params.id },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
            updatedById: session?.user?.id
          }
        });

        auditType = 'CONTENT_APPROVE_REVIEW';
        auditMeta.newStatus = 'PUBLISHED';
        auditMeta.publishedAt = updatedEntry.publishedAt;
        break;

      case 'reject':
        await enforcePermission(session, 'content.review');
        
        if (currentEntry.status !== 'REVIEW') {
          return NextResponse.json(
            { error: 'Only content in review can be rejected' },
            { status: 400 }
          );
        }

        updatedEntry = await prisma.contentEntry.update({
          where: { id: params.id },
          data: {
            status: 'DRAFT',
            updatedById: session?.user?.id
          }
        });

        auditType = 'CONTENT_REJECT_REVIEW';
        auditMeta.newStatus = 'DRAFT';
        auditMeta.feedback = feedback;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be submit, approve, or reject' },
          { status: 400 }
        );
    }

    // Audit the review action
    await auditContentAction(session, auditType, params.id, 'content', auditMeta, request);

    return NextResponse.json({
      entry: {
        id: updatedEntry.id,
        title: updatedEntry.title,
        status: updatedEntry.status,
        publishedAt: updatedEntry.publishedAt,
        updatedAt: updatedEntry.updatedAt
      },
      message: `Content ${action} successful`,
      ...(feedback && { feedback })
    });

  } catch (error) {
    console.error('Error in POST /api/content/[id]/review:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to process content review' },
      { status: 500 }
    );
  }
}
