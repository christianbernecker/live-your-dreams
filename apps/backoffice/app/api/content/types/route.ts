/**
 * Content Types API Routes
 * 
 * Manages content type definitions for the flexible CMS
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { auditFromSession } from '@/lib/audit';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { enforcePermission } from '@/lib/permissions';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// GET /api/content/types - List all content types
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    await enforcePermission(session, 'content.read');

    const url = new URL(request.url);
    const includeEntries = url.searchParams.get('includeEntries') === 'true';

    const contentTypes = await prisma.contentType.findMany({
      include: {
        entries: includeEntries ? {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5 // Only latest 5 entries per type
        } : false,
        _count: {
          select: {
            entries: true
          }
        }
      },
      where: {
        isActive: true
      },
      orderBy: [
        { name: 'asc' }
      ]
    });

    const formattedTypes = contentTypes.map(type => ({
      id: type.id,
      key: type.key,
      name: type.name,
      description: type.description,
      fields: type.fields,
      isActive: type.isActive,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
      entryCount: type._count.entries,
      ...(includeEntries && {
        recentEntries: type.entries
      })
    }));

    return NextResponse.json({ contentTypes: formattedTypes });

  } catch (error) {
    console.error('Error in GET /api/content/types:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch content types' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/content/types - Create new content type
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    await enforcePermission(session, 'content.types.manage');

    const body = await request.json();
    const {
      key,
      name,
      description,
      fields = {},
      isActive = true
    } = body;

    // Validate required fields
    if (!key || !name) {
      return NextResponse.json(
        { error: 'Key and name are required' },
        { status: 400 }
      );
    }

    // Validate key format (slug-friendly)
    if (!/^[a-z0-9-_]+$/.test(key)) {
      return NextResponse.json(
        { error: 'Key must contain only lowercase letters, numbers, hyphens and underscores' },
        { status: 400 }
      );
    }

    // Check if content type already exists
    const existingType = await prisma.contentType.findUnique({
      where: { key }
    });

    if (existingType) {
      return NextResponse.json(
        { error: 'Content type with this key already exists' },
        { status: 409 }
      );
    }

    // Validate fields schema
    if (typeof fields !== 'object') {
      return NextResponse.json(
        { error: 'Fields must be a valid JSON object' },
        { status: 400 }
      );
    }

    // Create content type
    const contentType = await prisma.contentType.create({
      data: {
        key,
        name,
        description,
        fields,
        isActive
      }
    });

    // Audit content type creation
    await auditFromSession(session, 'CONTENT_TYPE_CREATE', {
      contentTypeKey: key,
      contentTypeName: name,
      fieldsCount: Object.keys(fields).length
    }, request);

    return NextResponse.json({
      contentType: {
        id: contentType.id,
        key: contentType.key,
        name: contentType.name,
        description: contentType.description,
        fields: contentType.fields,
        isActive: contentType.isActive,
        createdAt: contentType.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/content/types:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    return NextResponse.json(
      { error: 'Failed to create content type' },
      { status: 500 }
    );
  }
}

