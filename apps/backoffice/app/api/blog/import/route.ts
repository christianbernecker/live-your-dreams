/**
 * LYD Blog System v1.1 - Import API
 * POST /api/blog/import
 * 
 * Accepts JSON v1.1 format from external KI agents
 * Validates, sanitizes, processes assets, and creates BlogPost entries
 */

import { auditLog } from '@/lib/audit';
import { uploadAssets } from '@/lib/blog/asset-manager';
import { getValidationErrors, IMPORT_LIMITS, validateImport } from '@/lib/blog/import-schema';
import { sanitizeHtmlContent } from '@/lib/blog/sanitizer';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// IMPORT API HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. AUTHENTICATION & AUTHORIZATION
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // Check permissions for blog import
    // TODO: Implement proper RBAC check
    const hasPermission = session.user.email === 'admin@liveyourdreams.online' ||
                         session.user.role === 'admin' ||
                         session.user.role === 'editor';
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions for blog import' }, 
        { status: 403 }
      );
    }

    // 2. REQUEST SIZE VALIDATION
    const contentLength = request.headers.get('content-length');
    if (contentLength && Number(contentLength) > IMPORT_LIMITS.MAX_JSON_SIZE) {
      return NextResponse.json(
        { 
          error: 'Request too large', 
          details: `Maximum size: ${IMPORT_LIMITS.MAX_JSON_SIZE / 1024 / 1024}MB` 
        }, 
        { status: 413 }
      );
    }

    // 3. JSON PARSING & VALIDATION
    let importData;
    try {
      importData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON format' }, 
        { status: 400 }
      );
    }

    // 4. SCHEMA VALIDATION
    const validation = validateImport(importData);
    if (!validation.success) {
      const errors = getValidationErrors(validation.error);
      
      // Audit failed import attempt
      await auditLog({
        type: 'BLOG_IMPORT_VALIDATION_FAILED',
        actorUserId: session.user.id,
        meta: { 
          validationErrors: errors.slice(0, 10), // Limit errors in audit
          errorCount: errors.length
        }
      });

      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: errors 
        }, 
        { status: 422 }
      );
    }

    const { content, assets, source } = validation.data;

    // 5. DUPLICATE SLUG CHECK
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: content.slug },
      select: { id: true, title: true }
    });

    if (existingPost) {
      // Auto-generate alternative slug
      const baseSlug = content.slug;
      let counter = 2;
      let newSlug = `${baseSlug}-${counter}`;
      
      while (await prisma.blogPost.findUnique({ where: { slug: newSlug } })) {
        counter++;
        newSlug = `${baseSlug}-${counter}`;
      }

      // Log suggestion but don't auto-apply
      return NextResponse.json(
        { 
          error: 'Slug already exists',
          details: { 
            existingPost: existingPost.title,
            suggestedSlug: newSlug 
          }
        }, 
        { status: 409 }
      );
    }

    // 6. HTML SANITIZATION
    let sanitizedContent = content.body || '';
    let sanitizedHtmlBlocks = content.htmlBlocks || [];

    if (sanitizedContent) {
      const sanitizationResult = await sanitizeHtmlContent(sanitizedContent, content.format);
      if (!sanitizationResult.success) {
        return NextResponse.json(
          { 
            error: 'Content sanitization failed', 
            details: sanitizationResult.errors 
          }, 
          { status: 422 }
        );
      }
      sanitizedContent = sanitizationResult.content;
    }

    // Sanitize HTML Blocks
    for (let i = 0; i < sanitizedHtmlBlocks.length; i++) {
      const block = sanitizedHtmlBlocks[i];
      const sanitizationResult = await sanitizeHtmlContent(block.html, 'html');
      
      if (!sanitizationResult.success) {
        return NextResponse.json(
          { 
            error: `HTML Block sanitization failed: ${block.id}`, 
            details: sanitizationResult.errors 
          }, 
          { status: 422 }
        );
      }
      
      sanitizedHtmlBlocks[i] = {
        ...block,
        html: sanitizationResult.content
      };
    }

    // 7. ASSET PROCESSING
    let processedFeaturedImage = content.featuredImage;
    let processedImages = content.images;
    let processedOgImage = content.seo.og?.image;

    if (assets && assets.length > 0) {
      try {
        const uploadResult = await uploadAssets(assets, content.slug);
        
        if (!uploadResult.success) {
          return NextResponse.json(
            { 
              error: 'Asset upload failed', 
              details: uploadResult.errors 
            }, 
            { status: 500 }
          );
        }

        // Replace asset: references with actual URLs
        const assetUrls = uploadResult.assetUrls;

        if (processedFeaturedImage?.src.startsWith('asset:')) {
          const assetName = processedFeaturedImage.src.replace('asset:', '');
          processedFeaturedImage = {
            ...processedFeaturedImage,
            src: assetUrls[assetName] || processedFeaturedImage.src
          };
        }

        processedImages = processedImages?.map(img => ({
          ...img,
          src: img.src.startsWith('asset:') 
            ? assetUrls[img.src.replace('asset:', '')] || img.src
            : img.src
        }));

        if (processedOgImage?.startsWith('asset:')) {
          const assetName = processedOgImage.replace('asset:', '');
          processedOgImage = assetUrls[assetName] || processedOgImage;
        }

      } catch (error) {
        console.error('Asset processing error:', error);
        return NextResponse.json(
          { error: 'Asset processing failed' }, 
          { status: 500 }
        );
      }
    }

    // 8. CREATE BLOG POST
    const blogPost = await prisma.blogPost.create({
      data: {
        // Core Content
        title: content.title,
        slug: content.slug,
        excerpt: content.excerpt,
        content: sanitizedContent,
        format: content.format,

        // SEO
        metaTitle: content.seo.metaTitle,
        metaDescription: content.seo.metaDescription,
        focusKeyword: content.seo.focusKeyword,
        keywords: content.seo.keywords,
        canonicalUrl: content.seo.canonicalUrl,
        ogTitle: content.seo.og?.title,
        ogDescription: content.seo.og?.description,
        ogImage: processedOgImage,

        // Structured Data
        jsonLd: content.jsonLd,

        // Visuals
        featuredImageUrl: processedFeaturedImage?.src,
        featuredImageAlt: processedFeaturedImage?.alt,

        // Rich Content
        htmlBlocks: sanitizedHtmlBlocks.length > 0 ? sanitizedHtmlBlocks : undefined,
        images: processedImages && processedImages.length > 0 ? processedImages : undefined,

        // Taxonomie & Distribution
        platforms: content.platforms,
        category: content.category,
        subcategory: content.subcategory,
        tags: content.tags,

        // Workflow (starts as DRAFT)
        status: 'DRAFT',

        // Audit
        authorId: session.user.id!,
        importSource: source.agent,
        importModel: source.model,
        importTimestamp: new Date(source.timestamp)
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        platforms: true,
        category: true,
        createdAt: true
      }
    });

    // 9. AUDIT SUCCESSFUL IMPORT
    await auditLog({
      type: 'BLOG_IMPORT_SUCCESS',
      actorUserId: session.user.id,
      blogPostId: blogPost.id,
      meta: {
        source: source,
        platforms: content.platforms,
        category: content.category,
        hasAssets: assets.length > 0,
        hasHtmlBlocks: sanitizedHtmlBlocks.length > 0,
        contentLength: sanitizedContent.length
      }
    });

    // 10. SUCCESS RESPONSE
    return NextResponse.json({
      success: true,
      blogPost: {
        id: blogPost.id,
        title: blogPost.title,
        slug: blogPost.slug,
        status: blogPost.status,
        platforms: blogPost.platforms,
        category: blogPost.category,
        createdAt: blogPost.createdAt
      },
      message: 'Blog post imported successfully as DRAFT',
      nextSteps: {
        editUrl: `/dashboard/blog/${blogPost.id}/edit`,
        reviewUrl: `/dashboard/blog/${blogPost.id}/review`
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Blog import error:', error);

    // Audit failed import
    try {
      if (session?.user?.id) {
        await auditLog({
          type: 'BLOG_IMPORT_ERROR',
          actorUserId: session.user.id,
          meta: { 
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }
    } catch (auditError) {
      console.error('Audit logging failed:', auditError);
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Blog import failed due to server error'
      }, 
      { status: 500 }
    );
  }
}

// ============================================================================
// METHOD NOT ALLOWED HANDLER
// ============================================================================

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for blog import.' }, 
    { status: 405 }
  );
}
