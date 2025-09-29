/**
 * Blog Post API - Single Post Operations
 * 
 * DELETE /api/blog/[id] - Delete a blog post
 * PATCH /api/blog/[id] - Update a blog post
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ============================================================================
// GET /api/blog/[id] - Get Single Blog Post
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth Check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Permission Check
    const userRole = (session.user as any).role || 'viewer';
    if (!['admin', 'editor'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = params;

    // Fetch the post
    const post = await prisma.blogPost.findUnique({
      where: { id },
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

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post);

  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json({
      error: 'Fetch failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/blog/[id] - Delete Blog Post
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth Check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Permission Check
    const userRole = (session.user as any).role || 'viewer';
    if (!['admin', 'editor'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = params;

    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Delete the post
    await prisma.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Blog delete error:', error);
    return NextResponse.json({
      error: 'Delete failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ============================================================================
// PATCH /api/blog/[id] - Update Blog Post
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth Check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Permission Check
    const userRole = (session.user as any).role || 'viewer';
    if (!['admin', 'editor'].includes(userRole)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Update the post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        // Core fields
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        format: body.format || 'mdx',
        
        // SEO
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        focusKeyword: body.focusKeyword,
        keywords: body.keywords || [],
        canonicalUrl: body.canonicalUrl,
        ogTitle: body.ogTitle,
        ogDescription: body.ogDescription,
        ogImage: body.ogImage,
        
        // Taxonomie
        platforms: body.platforms || [],
        category: body.category,
        subcategory: body.subcategory,
        tags: body.tags || [],
        
        // Workflow
        status: body.status || existingPost.status,
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
        publishedAt: body.status === 'PUBLISHED' && !existingPost.publishedAt 
          ? new Date() 
          : existingPost.publishedAt,
        
        // Visuals
        featuredImageUrl: body.featuredImageUrl,
        featuredImageAlt: body.featuredImageAlt,
        
        // Structured data
        jsonLd: body.jsonLd,
        htmlBlocks: body.htmlBlocks,
        images: body.images
      },
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

    return NextResponse.json({
      success: true,
      blogPost: updatedPost
    });

  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json({
      error: 'Update failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
