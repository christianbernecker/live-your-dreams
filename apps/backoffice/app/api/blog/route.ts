/**
 * LYD Blog System v1.1 - MICRO Implementation Step 2
 * 
 * Minimal API Route - nur native Next.js + Prisma
 * KEINE externen Dependencies, KEINE komplexen Types
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';

// ============================================================================
// SIMPLE GET HANDLER
// ============================================================================

export async function GET() {
  try {
    // Auth Check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    }

    // Simple Permission
    if (session.user.email !== 'admin@liveyourdreams.online') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    // Test Database Connection
    const count = await prisma.blogPost.count();
    
    return NextResponse.json({
      status: 'Blog API v1.1 online',
      count,
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
