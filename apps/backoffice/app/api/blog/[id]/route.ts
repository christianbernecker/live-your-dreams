/**
 * Blog Post API - Single Post Operations
 * 
 * DELETE /api/blog/[id] - Delete a blog post
 * PATCH /api/blog/[id] - Update a blog post
 */

import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ============================================================================
// GET /api/blog/[id] - Get Single Blog Post
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

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

    // Return clean response for edit page (ensure ALL fields are primitive types)
    return NextResponse.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      format: post.format,
      status: post.status,
      platforms: Array.isArray(post.platforms) ? post.platforms : [],
      category: post.category,
      subcategory: post.subcategory,
      tags: Array.isArray(post.tags) ? post.tags : [],
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      focusKeyword: post.focusKeyword,
      keywords: Array.isArray(post.keywords) ? post.keywords : [],
      canonicalUrl: post.canonicalUrl,
      ogTitle: post.ogTitle,
      ogDescription: post.ogDescription,
      ogImage: post.ogImage,
      featuredImageUrl: post.featuredImageUrl,
      featuredImageAlt: post.featuredImageAlt,
      scheduledFor: post.scheduledFor ? post.scheduledFor.toISOString() : null,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      // Only return author name, not the entire object
      authorName: post.author?.name || 'Unbekannt',
      // Media field (NEW - required for MediaManager)
      media: post.media || null
    });

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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
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
        
        // Media (NEW)
        media: body.media || null,
        
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
