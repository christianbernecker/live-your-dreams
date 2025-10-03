/**
 * API Route: GET /api/admin/api-stats
 * 
 * Liefert Quick Stats für Dashboard:
 * - Heute: Kosten + Calls
 * - Monat: Kosten + Calls + Tokens
 * 
 * Response:
 * {
 *   today: { cost, calls },
 *   month: { cost, calls, tokens }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Auth Check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Permission Check (Admin only)
    const isAdmin = session.user.permissions?.includes('users.read') || 
                    session.user.email === 'admin@liveyourdreams.online';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    console.log('📊 Calculating API Stats...');

    // Stats für HEUTE
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayStats: any[] = await prisma.$queryRaw`
      SELECT 
        COALESCE(COUNT(*), 0) as calls,
        COALESCE(SUM(total_cost), 0) as cost
      FROM api_usage_logs
      WHERE created_at >= ${todayStart}::timestamp
    `;

    // Stats für AKTUELLEN MONAT
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthStats: any[] = await prisma.$queryRaw`
      SELECT 
        COALESCE(COUNT(*), 0) as calls,
        COALESCE(SUM(total_cost), 0) as cost,
        COALESCE(SUM(total_tokens), 0) as tokens
      FROM api_usage_logs
      WHERE created_at >= ${monthStart}::timestamp
    `;

    const today = {
      cost: parseFloat(todayStats[0]?.cost || 0),
      calls: Number(todayStats[0]?.calls || 0)
    };

    const month = {
      cost: parseFloat(monthStats[0]?.cost || 0),
      calls: Number(monthStats[0]?.calls || 0),
      tokens: Number(monthStats[0]?.tokens || 0)
    };

    console.log('✅ Stats berechnet:', { today, month });

    return NextResponse.json({ today, month });

  } catch (error) {
    console.error('❌ API Stats Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

