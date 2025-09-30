/**
 * Debug Route für Blog Post API
 * GET /api/blog/[id]/debug - Detaillierte Fehlerausgabe
 */

import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const debugInfo: any = {
    step: 'start',
    timestamp: new Date().toISOString()
  };

  try {
    debugInfo.step = 'auth';
    const session = await auth();
    debugInfo.session = {
      exists: !!session,
      userId: session?.user?.id || null,
      userRole: (session?.user as any)?.role || null
    };

    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Authentication required',
        debug: debugInfo
      }, { status: 401 });
    }

    debugInfo.step = 'params';
    const { id } = await params;
    debugInfo.postId = id;

    debugInfo.step = 'prisma-fetch';
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

    debugInfo.step = 'post-found';
    debugInfo.postExists = !!post;

    if (!post) {
      return NextResponse.json({
        error: 'Post not found',
        debug: debugInfo
      }, { status: 404 });
    }

    debugInfo.step = 'field-types';
    debugInfo.fieldTypes = {
      platforms: typeof post.platforms + ' / isArray: ' + Array.isArray(post.platforms),
      tags: typeof post.tags + ' / isArray: ' + Array.isArray(post.tags),
      keywords: typeof post.keywords + ' / isArray: ' + Array.isArray(post.keywords),
      images: typeof post.images,
      jsonLd: typeof post.jsonLd,
      htmlBlocks: typeof post.htmlBlocks,
      author: typeof post.author,
      scheduledFor: typeof post.scheduledFor,
      publishedAt: typeof post.publishedAt
    };

    debugInfo.step = 'serialize-test';
    const cleanData = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content.substring(0, 100) + '...',
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
      authorName: post.author?.name || 'Unbekannt'
    };

    debugInfo.step = 'success';
    debugInfo.cleanDataFieldCount = Object.keys(cleanData).length;

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      sampleData: cleanData
    });

  } catch (error) {
    debugInfo.step = 'error';
    debugInfo.error = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
      type: error?.constructor?.name
    };

    return NextResponse.json({
      error: 'Debug failed',
      debug: debugInfo
    }, { status: 500 });
  }
}
