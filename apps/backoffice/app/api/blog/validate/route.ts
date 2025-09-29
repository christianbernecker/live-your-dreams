/**
 * LYD Blog System v1.1 - Validation API
 * POST /api/blog/validate
 * 
 * Dry-run validation of JSON v1.1 import format
 * No persistence, only validation and preview
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';
import { validateImport, getValidationErrors, IMPORT_LIMITS } from '@/lib/blog/import-schema';
import { sanitizeHtmlContent, validateHtmlBlock } from '@/lib/blog/sanitizer';
import { extractAssetMetadata } from '@/lib/blog/asset-manager';

// ============================================================================
// VALIDATION API HANDLER
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

    // Check permissions for blog validation
    const hasPermission = session.user.email === 'admin@liveyourdreams.online' ||
                         session.user.role === 'admin' ||
                         session.user.role === 'editor' ||
                         session.user.role === 'author';
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions for blog validation' }, 
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

    // 3. JSON PARSING
    let importData;
    try {
      importData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON format',
          details: 'Request body must be valid JSON'
        }, 
        { status: 400 }
      );
    }

    // 4. SCHEMA VALIDATION
    const validation = validateImport(importData);
    if (!validation.success) {
      const errors = getValidationErrors(validation.error);
      
      return NextResponse.json({
        valid: false,
        errors,
        summary: {
          errorCount: errors.length,
          criticalErrors: errors.filter(e => 
            e.path.includes('title') || 
            e.path.includes('slug') || 
            e.path.includes('platforms')
          ).length
        }
      }, { status: 422 });
    }

    const { content, assets, source } = validation.data;

    // 5. EXTENDED VALIDATION CHECKS
    const warnings: string[] = [];
    const securityIssues: string[] = [];
    const recommendations: string[] = [];

    // Slug uniqueness check
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: content.slug },
      select: { id: true, title: true, status: true }
    });

    if (existingPost) {
      warnings.push(`Slug "${content.slug}" is already used by: "${existingPost.title}" (Status: ${existingPost.status})`);
      recommendations.push(`Consider using a different slug or append a suffix like "-2"`);
    }

    // 6. CONTENT SANITIZATION PREVIEW
    let contentSanitization: any = null;
    let htmlBlocksSanitization: any[] = [];

    if (content.body) {
      const sanitizationResult = await sanitizeHtmlContent(content.body, content.format);
      
      contentSanitization = {
        format: content.format,
        originalLength: content.body.length,
        sanitizedLength: sanitizationResult.success ? sanitizationResult.content.length : 0,
        success: sanitizationResult.success,
        warnings: sanitizationResult.success ? sanitizationResult.warnings : undefined,
        errors: sanitizationResult.success ? undefined : sanitizationResult.errors,
        contentReduced: sanitizationResult.success && 
                       sanitizationResult.content.length < content.body.length * 0.95
      };

      if (!sanitizationResult.success) {
        securityIssues.push('Content contains unsafe HTML that cannot be sanitized');
      }
    }

    // HTML Blocks sanitization
    if (content.htmlBlocks && content.htmlBlocks.length > 0) {
      for (const block of content.htmlBlocks) {
        const blockValidation = await validateHtmlBlock(block);
        
        htmlBlocksSanitization.push({
          id: block.id,
          title: block.title,
          originalHtmlLength: block.html.length,
          sanitizedHtmlLength: blockValidation.success ? blockValidation.content.length : 0,
          success: blockValidation.success,
          warnings: blockValidation.success ? blockValidation.warnings : undefined,
          errors: blockValidation.success ? undefined : blockValidation.errors,
          hasCss: !!block.css,
          hasJs: !!block.js,
          cssLength: block.css?.length || 0,
          jsLength: block.js?.length || 0
        });

        if (!blockValidation.success) {
          securityIssues.push(`HTML Block "${block.id}" contains unsafe content`);
        }
      }
    }

    // 7. ASSET VALIDATION
    let assetValidation: any = null;
    
    if (assets && assets.length > 0) {
      let totalAssetSize = 0;
      const assetSummary = assets.map(asset => {
        const metadata = extractAssetMetadata(asset);
        totalAssetSize += metadata.size || 0;
        
        return {
          name: asset.name,
          mime: asset.mime,
          encoding: asset.encoding,
          estimatedSize: metadata.size,
          estimatedSizeMB: Math.round((metadata.size || 0) / 1024 / 1024 * 100) / 100
        };
      });

      assetValidation = {
        totalAssets: assets.length,
        totalSizeMB: Math.round(totalAssetSize / 1024 / 1024 * 100) / 100,
        maxAllowedSizeMB: IMPORT_LIMITS.MAX_TOTAL_ASSETS_SIZE / 1024 / 1024,
        withinSizeLimit: totalAssetSize <= IMPORT_LIMITS.MAX_TOTAL_ASSETS_SIZE,
        assets: assetSummary
      };

      if (totalAssetSize > IMPORT_LIMITS.MAX_TOTAL_ASSETS_SIZE) {
        securityIssues.push('Total asset size exceeds limit');
      }
    }

    // 8. SEO VALIDATION
    const seoValidation = {
      hasMetaTitle: !!content.seo.metaTitle,
      hasMetaDescription: !!content.seo.metaDescription,
      hasFocusKeyword: !!content.seo.focusKeyword,
      hasCanonicalUrl: !!content.seo.canonicalUrl,
      hasOpenGraph: !!content.seo.og,
      hasJsonLd: !!content.jsonLd,
      titleLength: content.title.length,
      titleOptimal: content.title.length >= 30 && content.title.length <= 60,
      excerptLength: content.excerpt.length,
      excerptOptimal: content.excerpt.length >= 120 && content.excerpt.length <= 160,
      keywordCount: content.seo.keywords.length,
      tagCount: content.tags.length
    };

    // SEO recommendations
    if (!seoValidation.hasMetaTitle) recommendations.push('Add meta title for better SEO');
    if (!seoValidation.hasMetaDescription) recommendations.push('Add meta description for better SEO');
    if (!seoValidation.hasFocusKeyword) recommendations.push('Define a focus keyword');
    if (!seoValidation.titleOptimal) recommendations.push('Title should be 30-60 characters for optimal SEO');
    if (!seoValidation.excerptOptimal) recommendations.push('Excerpt should be 120-160 characters');

    // 9. PLATFORM-SPECIFIC VALIDATION
    const platformValidation = content.platforms.map(platform => {
      let categoryMatch = false;
      let categoryRecommendations: string[] = [];

      const category = content.category.toLowerCase();
      
      switch (platform) {
        case 'WOHNEN':
          categoryMatch = ['ratgeber', 'markt', 'recht', 'diy', 'verkauf', 'kauf']
            .some(cat => category.includes(cat));
          if (!categoryMatch) {
            categoryRecommendations.push('Consider categories like: Ratgeber, Markt, Recht, DIY, Verkauf, Kauf');
          }
          break;
          
        case 'MAKLER':
          categoryMatch = ['premium', 'investment', 'referenz', 'luxury', 'off-market']
            .some(cat => category.includes(cat));
          if (!categoryMatch) {
            categoryRecommendations.push('Consider categories like: Premium, Investment, Referenz, Luxury, Off-Market');
          }
          break;
          
        case 'ENERGIE':
          categoryMatch = ['geg', 'förderung', 'technik', 'modernisierung', 'energieausweis', 'sanierung']
            .some(cat => category.includes(cat));
          if (!categoryMatch) {
            categoryRecommendations.push('Consider categories like: GEG, Förderung, Technik, Modernisierung, Energieausweis, Sanierung');
          }
          break;
      }

      return {
        platform,
        categoryMatch,
        recommendations: categoryRecommendations
      };
    });

    // 10. GENERATE VALIDATION SUMMARY
    const validationSummary = {
      valid: true,
      
      // Core validation
      schema: {
        valid: true,
        version: source.agent,
        model: source.model,
        timestamp: source.timestamp
      },
      
      // Content validation
      content: {
        title: content.title,
        slug: content.slug,
        excerpt: content.excerpt,
        format: content.format,
        platforms: content.platforms,
        category: content.category,
        subcategory: content.subcategory,
        tags: content.tags,
        hasBody: !!content.body,
        hasHtmlBlocks: (content.htmlBlocks || []).length > 0,
        hasFeaturedImage: !!content.featuredImage
      },
      
      // Validation results
      sanitization: {
        content: contentSanitization,
        htmlBlocks: htmlBlocksSanitization
      },
      
      assets: assetValidation,
      seo: seoValidation,
      platforms: platformValidation,
      
      // Issues and recommendations
      warnings,
      securityIssues,
      recommendations,
      
      // Summary counts
      summary: {
        totalWarnings: warnings.length,
        totalSecurityIssues: securityIssues.length,
        totalRecommendations: recommendations.length,
        readyForImport: securityIssues.length === 0,
        confidence: securityIssues.length === 0 ? 
                   (warnings.length === 0 ? 'high' : 'medium') : 'low'
      }
    };

    return NextResponse.json(validationSummary, { status: 200 });

  } catch (error) {
    console.error('Blog validation error:', error);

    return NextResponse.json(
      { 
        valid: false,
        error: 'Validation failed due to server error',
        details: error instanceof Error ? error.message : 'Unknown error'
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
    { error: 'Method not allowed. Use POST for blog validation.' }, 
    { status: 405 }
  );
}
