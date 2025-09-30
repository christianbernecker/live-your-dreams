/**
 * LYD Blog System v1.1 - MICRO Implementation Step 2
 * 
 * Minimal API Route - nur native Next.js + Prisma
 * KEINE externen Dependencies, KEINE komplexen Types
 */

import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { NextRequest, NextResponse } from 'next/server';

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

// ============================================================================
// POST /api/blog - Create New Blog Post
// ============================================================================

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validation
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json({ message: 'Titel ist erforderlich' }, { status: 400 });
    }
    if (!body.slug || body.slug.trim().length === 0) {
      return NextResponse.json({ message: 'Slug ist erforderlich' }, { status: 400 });
    }
    if (!body.excerpt || body.excerpt.trim().length === 0) {
      return NextResponse.json({ message: 'Zusammenfassung ist erforderlich' }, { status: 400 });
    }
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ message: 'Inhalt ist erforderlich' }, { status: 400 });
    }

    // Length validation
    if (body.title.length > 120) {
      return NextResponse.json({ message: 'Titel darf maximal 120 Zeichen lang sein' }, { status: 400 });
    }
    if (body.excerpt.length > 200) {
      return NextResponse.json({ message: 'Zusammenfassung darf maximal 200 Zeichen lang sein' }, { status: 400 });
    }
    if (body.metaTitle && body.metaTitle.length > 120) {
      return NextResponse.json({ message: 'Meta Titel darf maximal 120 Zeichen lang sein' }, { status: 400 });
    }
    if (body.metaDescription && body.metaDescription.length > 200) {
      return NextResponse.json({ message: 'Meta Beschreibung darf maximal 200 Zeichen lang sein' }, { status: 400 });
    }

    // Check if slug is unique
    const existingPost = await prisma.blogPost.findFirst({
      where: { slug: body.slug }
    });
    if (existingPost) {
      return NextResponse.json({ message: `Der Slug "${body.slug}" wird bereits verwendet` }, { status: 400 });
    }

    // Create new blog post
    const newPost = await prisma.blogPost.create({
      data: {
        // Core fields
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        format: body.format || 'mdx',
        
        // SEO
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        focusKeyword: body.focusKeyword || null,
        keywords: body.keywords || [],
        canonicalUrl: body.canonicalUrl || null,
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImage: body.ogImage || null,
        
        // Taxonomie
        platforms: body.platforms || [],
        category: body.category || 'Uncategorized',
        subcategory: body.subcategory || null,
        tags: body.tags || [],
        
        // Workflow
        status: body.status || 'DRAFT',
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : null,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
        
        // Visuals
        featuredImageUrl: body.featuredImageUrl || null,
        featuredImageAlt: body.featuredImageAlt || null,
        
        // Structured data
        jsonLd: body.jsonLd || null,
        htmlBlocks: body.htmlBlocks || null,
        images: body.images || null,
        
        // Author (from session)
        authorId: session.user.id
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
      blogPost: newPost
    }, { status: 201 });

  } catch (error) {
    console.error('Blog create error:', error);
    return NextResponse.json({
      error: 'Create failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
