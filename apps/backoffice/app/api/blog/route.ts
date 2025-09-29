/**
 * LYD Blog System v1.1 - MICRO Implementation Step 2
 * 
 * Minimal API Route - nur native Next.js + Prisma
 * KEINE externen Dependencies, KEINE komplexen Types
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';

// Force dynamic rendering (uses auth())
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ============================================================================
// SIMPLE GET HANDLER
// ============================================================================

export async function GET() {
  try {
    // Auth Check (consistent with /api/users)
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Simple Permission (consistent with /api/users)
    const userRole = (session.user as any).role || 'viewer';
    if (!['admin', 'editor'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Fetch blog posts with author information
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to latest 50 posts
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Calculate statistics
    const stats = {
      total: await prisma.blogPost.count(),
      published: await prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      draft: await prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      review: await prisma.blogPost.count({ where: { status: 'REVIEW' } }),
      scheduled: await prisma.blogPost.count({ where: { status: 'SCHEDULED' } })
    };
    
    return NextResponse.json({
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        platforms: post.platforms,
        category: post.category,
        createdAt: post.createdAt.toISOString(),
        author: post.author
      })),
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json({ 
      error: 'Database error',
      message: error instanceof Error ? error.message : 'Unknown'
    }, { status: 500 });
  }
}
