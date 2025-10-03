/**
 * API Route: GET /api/admin/api-usage/recent
 * 
 * Liefert die letzten 10 API Calls mit Details
 * 
 * Response:
 * {
 *   calls: [{
 *     id, timestamp, feature, model, tokens,
 *     cost, status, durationMs, errorMessage?
 *   }]
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

    console.log('📜 Fetching recent API calls...');

    // Fetch letzte 10 Calls
    const rawCalls: any[] = await prisma.$queryRaw`
      SELECT 
        id,
        created_at,
        feature,
        model,
        total_tokens,
        total_cost,
        status,
        duration_ms,
        error_message
      FROM api_usage_logs
      ORDER BY created_at DESC
      LIMIT 10
    `;

    console.log(`✅ Gefunden: ${rawCalls.length} recent calls`);

    // Map zu Frontend-Format
    const calls = rawCalls.map((call) => ({
      id: call.id,
      timestamp: new Date(call.created_at).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      feature: call.feature,
      model: call.model,
      tokens: Number(call.total_tokens),
      cost: parseFloat(call.total_cost),
      status: call.status,
      durationMs: Number(call.duration_ms),
      errorMessage: call.error_message || undefined
    }));

    return NextResponse.json({ calls });

  } catch (error) {
    console.error('❌ API Usage Recent Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

