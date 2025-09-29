/**
 * LYD Blog System v1.1 - MICRO Step 3
 * 
 * Basic TypeScript Types - KEINE externen Dependencies
 * Nur native TypeScript Interfaces
 */

// ============================================================================
// BASIC BLOG TYPES (Native TypeScript only)
// ============================================================================

export type BlogStatus = 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED';

export type Platform = 'WOHNEN' | 'MAKLER' | 'ENERGIE';

export type ContentFormat = 'md' | 'mdx' | 'html';

// ============================================================================
// BLOG POST INTERFACE (Database mapped)
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  format: ContentFormat;

  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;

  // Structured Data
  jsonLd?: any; // JSON object

  // Visuals
  featuredImageUrl?: string;
  featuredImageAlt?: string;

  // Rich Content (JSON stored)
  htmlBlocks?: any; // JSON array
  images?: any; // JSON array

  // Multi-Platform
  platforms: Platform[];
  category: string;
  subcategory?: string;
  tags: string[];

  // Workflow
  status: BlogStatus;
  scheduledFor?: Date;
  publishedAt?: Date;

  // Metadata
  authorId: string;
  importSource?: string;
  importModel?: string;
  importTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional)
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

// ============================================================================
// BASIC IMPORT TYPES (Simplified)
// ============================================================================

export interface SimpleImportData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  platforms: Platform[];
  category: string;
  status?: BlogStatus;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface BlogListResponse {
  posts: BlogPost[];
  stats: {
    total: number;
    published: number;
    draft: number;
    review: number;
    scheduled: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BlogCreateResponse {
  success: boolean;
  blogPost?: {
    id: string;
    title: string;
    slug: string;
    status: BlogStatus;
  };
  error?: string;
  message?: string;
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface BlogFilters {
  status?: BlogStatus | 'all';
  platforms?: Platform[];
  categories?: string[];
  search?: string;
  dateRange?: 'all' | '7days' | '30days' | '90days';
  page?: number;
  limit?: number;
}

// ============================================================================
// VALIDATION HELPERS (Native TypeScript)
// ============================================================================

export function isValidPlatform(platform: string): platform is Platform {
  return ['WOHNEN', 'MAKLER', 'ENERGIE'].includes(platform);
}

export function isValidStatus(status: string): status is BlogStatus {
  return ['DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', 'REJECTED'].includes(status);
}

export function isValidFormat(format: string): format is ContentFormat {
  return ['md', 'mdx', 'html'].includes(format);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äöü]/g, (match) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue' }[match] || match))
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]{5,100}$/.test(slug) && 
         !slug.startsWith('-') && 
         !slug.endsWith('-');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
