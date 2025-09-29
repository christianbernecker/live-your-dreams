/**
 * LYD Blog System v1.1 - Blog Posts API
 * GET /api/blog - List blog posts with filtering
 * 
 * Supports filtering by status, platforms, categories, date ranges, and search
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';
import type { BlogStatus, Platform } from '@prisma/client';

// ============================================================================
// TYPES
// ============================================================================

interface BlogPostsQuery {
  status?: string;
  platforms?: string;
  categories?: string;
  authors?: string;
  dateRange?: string;
  search?: string;
  page?: string;
  limit?: string;
}

// ============================================================================
// GET HANDLER - List Blog Posts
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. AUTHENTICATION
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    const hasPermission = session.user.email === 'admin@liveyourdreams.online' ||
                         session.user.role === 'admin' ||
                         session.user.role === 'editor' ||
                         session.user.role === 'author';
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions for blog access' },
        { status: 403 }
      );
    }

    // 2. PARSE QUERY PARAMETERS
    const url = new URL(request.url);
    const query: BlogPostsQuery = {
      status: url.searchParams.get('status') || undefined,
      platforms: url.searchParams.get('platforms') || undefined,
      categories: url.searchParams.get('categories') || undefined,
      authors: url.searchParams.get('authors') || undefined,
      dateRange: url.searchParams.get('dateRange') || undefined,
      search: url.searchParams.get('search') || undefined,
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '20'
    };

    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20')));
    const skip = (page - 1) * limit;

    // 3. BUILD WHERE CLAUSE
    const whereClause: any = {};

    // Status filter
    if (query.status && query.status !== 'all') {
      whereClause.status = query.status as BlogStatus;
    }

    // Platform filter
    if (query.platforms) {
      const platformList = query.platforms.split(',')
        .filter(p => ['WOHNEN', 'MAKLER', 'ENERGIE'].includes(p));
      
      if (platformList.length > 0) {
        whereClause.platforms = {
          hasSome: platformList as Platform[]
        };
      }
    }

    // Category filter
    if (query.categories) {
      const categoryList = query.categories.split(',').map(c => c.trim());
      whereClause.category = {
        in: categoryList
      };
    }

    // Author filter
    if (query.authors) {
      const authorList = query.authors.split(',').map(a => a.trim());
      whereClause.authorId = {
        in: authorList
      };
    }

    // Date range filter
    if (query.dateRange && query.dateRange !== 'all') {
      const now = new Date();
      let fromDate: Date;

      switch (query.dateRange) {
        case '7days':
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          fromDate = new Date(0); // Beginning of time
      }

      whereClause.createdAt = {
        gte: fromDate
      };
    }

    // Search filter (title, content, tags)
    if (query.search) {
      const searchTerm = query.search.trim();
      if (searchTerm.length >= 2) {
        whereClause.OR = [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            excerpt: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            tags: {
              has: searchTerm
            }
          },
          {
            category: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ];
      }
    }

    // 4. FETCH BLOG POSTS
    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: [
          { status: 'asc' }, // DRAFT first, then PUBLISHED, etc.
          { updatedAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.blogPost.count({
        where: whereClause
      })
    ]);

    // 5. FETCH STATISTICS
    const stats = await prisma.blogPost.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const statsFormatted = {
      total: totalCount,
      draft: stats.find(s => s.status === 'DRAFT')?._count.status || 0,
      review: stats.find(s => s.status === 'REVIEW')?._count.status || 0,
      scheduled: stats.find(s => s.status === 'SCHEDULED')?._count.status || 0,
      published: stats.find(s => s.status === 'PUBLISHED')?._count.status || 0,
      archived: stats.find(s => s.status === 'ARCHIVED')?._count.status || 0,
      rejected: stats.find(s => s.status === 'REJECTED')?._count.status || 0
    };

    // 6. FORMAT RESPONSE
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      status: post.status,
      platforms: post.platforms,
      category: post.category,
      subcategory: post.subcategory,
      tags: post.tags,
      featuredImageUrl: post.featuredImageUrl,
      publishedAt: post.publishedAt?.toISOString(),
      scheduledFor: post.scheduledFor?.toISOString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: {
        id: post.author.id,
        name: post.author.name || post.author.email,
        email: post.author.email,
        image: post.author.image
      },
      importSource: post.importSource,
      importModel: post.importModel,
      // Don't expose content in list view for performance
    }));

    // 7. PAGINATION INFO
    const hasNextPage = skip + limit < totalCount;
    const hasPrevPage = page > 1;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      posts: formattedPosts,
      stats: statsFormatted,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        applied: Object.keys(query).filter(key => 
          query[key as keyof BlogPostsQuery] && 
          query[key as keyof BlogPostsQuery] !== 'all' &&
          key !== 'page' && 
          key !== 'limit'
        )
      }
    });

  } catch (error) {
    console.error('Blog posts fetch error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch blog posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST HANDLER - Create Blog Post (Manual Creation)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. AUTHENTICATION
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    const hasPermission = session.user.email === 'admin@liveyourdreams.online' ||
                         session.user.role === 'admin' ||
                         session.user.role === 'editor';
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions for blog creation' },
        { status: 403 }
      );
    }

    // 2. PARSE REQUEST
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.slug || !body.platforms || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, platforms, category' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: body.slug }
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists', slug: body.slug },
        { status: 409 }
      );
    }

    // 3. CREATE BLOG POST
    const blogPost = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || '',
        content: body.content || '',
        format: body.format || 'mdx',
        
        // SEO
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        focusKeyword: body.focusKeyword,
        keywords: body.keywords || [],
        
        // Taxonomie
        platforms: body.platforms,
        category: body.category,
        subcategory: body.subcategory,
        tags: body.tags || [],
        
        // Status
        status: 'DRAFT',
        
        // Author
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
      blogPost: {
        id: blogPost.id,
        title: blogPost.title,
        slug: blogPost.slug,
        status: blogPost.status,
        platforms: blogPost.platforms,
        category: blogPost.category,
        author: blogPost.author,
        createdAt: blogPost.createdAt
      },
      message: 'Blog post created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Blog post creation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create blog post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
