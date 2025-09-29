/**
 * Content Entries API Routes
 * 
 * Provides CRUD operations for content entries with workflow support
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { auditContentAction } from '@/lib/audit';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { enforcePermission } from '@/lib/permissions';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// GET /api/content - List content entries
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    await enforcePermission(session, 'content.read');

    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const search = url.searchParams.get('search') || '';
    const typeKey = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const authorId = url.searchParams.get('author');
    const includeDeleted = url.searchParams.get('includeDeleted') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (!includeDeleted) {
      where.deletedAt = null;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (typeKey) {
      where.type = { key: typeKey };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (authorId) {
      where.authorId = authorId;
    }

    // Get content entries with pagination
    const [entries, totalCount] = await Promise.all([
      prisma.contentEntry.findMany({
        where,
        include: {
          type: {
            select: {
              id: true,
              key: true,
              name: true
            }
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.contentEntry.count({ where })
    ]);

    const formattedEntries = entries.map(entry => ({
      id: entry.id,
      title: entry.title,
      slug: entry.slug,
      status: entry.status,
      publishedAt: entry.publishedAt,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      deletedAt: entry.deletedAt,
      type: entry.type,
      author: entry.author,
      updatedBy: entry.updatedBy,
      // Don't include full data in list view for performance
      hasData: entry.data && Object.keys(entry.data as any).length > 0
    }));

    return NextResponse.json({
      entries: formattedEntries,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/content:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch content entries' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/content - Create new content entry
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    await enforcePermission(session, 'content.write');

    const body = await request.json();
    const {
      typeId,
      title,
      slug,
      data = {},
      status = 'DRAFT',
      publishedAt
    } = body;

    // Validate required fields
    if (!typeId || !title) {
      return NextResponse.json(
        { error: 'Type ID and title are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);

    // Validate content type exists
    const contentType = await prisma.contentType.findUnique({
      where: { id: typeId },
      select: { id: true, key: true, name: true, fields: true }
    });

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type not found' },
        { status: 404 }
      );
    }

    // Check if slug is unique
    const existingEntry = await prisma.contentEntry.findUnique({
      where: { slug: finalSlug }
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Content with this slug already exists' },
        { status: 409 }
      );
    }

    // Validate status transition permissions
    if (status === 'PUBLISHED') {
      await enforcePermission(session, 'content.publish');
    } else if (status === 'REVIEW') {
      await enforcePermission(session, 'content.review');
    }

    // Create content entry
    const entry = await prisma.contentEntry.create({
      data: {
        typeId,
        title,
        slug: finalSlug,
        data,
        status,
        authorId: session?.user?.id,
        ...(status === 'PUBLISHED' && publishedAt && { publishedAt: new Date(publishedAt) })
      },
      include: {
        type: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Audit content creation
    await auditContentAction(session, 'CONTENT_CREATE', entry.id, 'content', {
      contentType: contentType.key,
      title,
      slug: finalSlug,
      status,
      dataFieldsCount: Object.keys(data).length
    }, request);

    return NextResponse.json({
      entry: {
        id: entry.id,
        title: entry.title,
        slug: entry.slug,
        data: entry.data,
        status: entry.status,
        publishedAt: entry.publishedAt,
        createdAt: entry.createdAt,
        type: entry.type,
        author: entry.author
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/content:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to create content entry' },
      { status: 500 }
    );
  }
}

