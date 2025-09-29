/**
 * LYD Blog System v1.1 - MICRO Step 6
 * 
 * Simple JSON Import - nur native JavaScript Validation
 * KEINE Zod, KEINE komplexen Dependencies
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';
import { sanitizeHtmlContent } from '@/lib/blog/sanitizer';
import type { Platform, BlogStatus } from '@/lib/blog/types';

// ============================================================================
// SIMPLE VALIDATION FUNCTIONS
// ============================================================================

function isValidPlatform(platform: string): platform is Platform {
  return ['WOHNEN', 'MAKLER', 'ENERGIE'].includes(platform);
}

function isValidFormat(format: string): boolean {
  return ['md', 'mdx', 'html'].includes(format);
}

function validateBasicImport(data: any): { valid: true; cleaned: any } | { valid: false; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.content?.title || typeof data.content.title !== 'string' || data.content.title.length < 5) {
    errors.push('Title is required (min 5 characters)');
  }

  if (!data.content?.slug || typeof data.content.slug !== 'string' || data.content.slug.length < 5) {
    errors.push('Slug is required (min 5 characters)');
  }

  if (!data.content?.excerpt || typeof data.content.excerpt !== 'string' || data.content.excerpt.length < 10) {
    errors.push('Excerpt is required (min 10 characters)');
  }

  if (!data.content?.platforms || !Array.isArray(data.content.platforms) || data.content.platforms.length === 0) {
    errors.push('At least one platform is required');
  } else {
    const invalidPlatforms = data.content.platforms.filter((p: string) => !isValidPlatform(p));
    if (invalidPlatforms.length > 0) {
      errors.push(`Invalid platforms: ${invalidPlatforms.join(', ')}`);
    }
  }

  if (!data.content?.category || typeof data.content.category !== 'string') {
    errors.push('Category is required');
  }

  if (!data.content?.body && !data.content?.htmlBlocks) {
    errors.push('Either body content or htmlBlocks is required');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Clean and prepare data
  const cleaned = {
    title: String(data.content.title).substring(0, 120),
    slug: String(data.content.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 100),
    excerpt: String(data.content.excerpt).substring(0, 200),
    content: String(data.content.body || ''),
    format: isValidFormat(data.content.format) ? data.content.format : 'mdx',
    platforms: data.content.platforms.filter((p: string) => isValidPlatform(p)),
    category: String(data.content.category),
    subcategory: data.content.subcategory ? String(data.content.subcategory) : undefined,
    tags: Array.isArray(data.content.tags) ? data.content.tags.map(String).slice(0, 10) : [],
    
    // SEO (optional)
    metaTitle: data.content.seo?.metaTitle ? String(data.content.seo.metaTitle).substring(0, 120) : undefined,
    metaDescription: data.content.seo?.metaDescription ? String(data.content.seo.metaDescription).substring(0, 200) : undefined,
    
    // Source tracking
    importSource: data.source?.agent ? String(data.source.agent) : 'unknown',
    importModel: data.source?.model ? String(data.source.model) : undefined
  };

  return { valid: true, cleaned };
}

// ============================================================================
// IMPORT HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 2. Permission check
    const hasPermission = session.user.email === 'admin@liveyourdreams.online' ||
                         session.user.role === 'admin' ||
                         session.user.role === 'editor';
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // 3. Parse JSON
    let importData;
    try {
      importData = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    // 4. Basic validation
    const validation = validateBasicImport(importData);
    if (!validation.valid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        issues: validation.errors 
      }, { status: 422 });
    }

    const cleaned = validation.cleaned;

    // 5. Check slug uniqueness
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: cleaned.slug }
    });

    if (existingPost) {
      return NextResponse.json({ 
        error: 'Slug already exists', 
        suggestion: `${cleaned.slug}-${Date.now()}` 
      }, { status: 409 });
    }

    // 6. Sanitize content
    const sanitizationResult = await sanitizeHtmlContent(cleaned.content, cleaned.format);
    
    if (!sanitizationResult.success) {
      return NextResponse.json({ 
        error: 'Content sanitization failed', 
        issues: sanitizationResult.errors 
      }, { status: 422 });
    }

    // 7. Create blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title: cleaned.title,
        slug: cleaned.slug,
        excerpt: cleaned.excerpt,
        content: sanitizationResult.content,
        format: cleaned.format,
        
        // SEO
        metaTitle: cleaned.metaTitle,
        metaDescription: cleaned.metaDescription,
        keywords: cleaned.tags, // Use tags as keywords for now
        
        // Multi-Platform
        platforms: cleaned.platforms,
        category: cleaned.category,
        subcategory: cleaned.subcategory,
        tags: cleaned.tags,
        
        // Status
        status: 'DRAFT',
        
        // Author & Import tracking
        authorId: session.user.id,
        importSource: cleaned.importSource,
        importModel: cleaned.importModel,
        importTimestamp: new Date()
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      blogPost: {
        id: blogPost.id,
        title: blogPost.title,
        slug: blogPost.slug,
        status: blogPost.status,
        platforms: blogPost.platforms,
        category: blogPost.category,
        author: blogPost.author
      },
      message: 'Blog post imported successfully as DRAFT',
      warnings: sanitizationResult.warnings
    }, { status: 201 });

  } catch (error) {
    console.error('Blog import error:', error);

    return NextResponse.json({
      error: 'Import failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
