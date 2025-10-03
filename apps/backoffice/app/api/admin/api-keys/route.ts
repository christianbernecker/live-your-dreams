/**
 * API Route: GET /api/admin/api-keys
 * 
 * Liefert alle API Keys mit Nutzungsstatistiken (OHNE Entschlüsselung)
 * Nur maskierte Keys werden ausgeliefert für Sicherheit
 * 
 * Response:
 * {
 *   keys: [{
 *     id, provider, name, keyMasked, isActive, 
 *     calls, monthlyCost, lastUsedAt
 *   }]
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// Key Maskierung OHNE Entschlüsselung (sicherer)
function maskApiKey(keyHash: string): string {
  // Nehme einfach die ersten 7 und letzten 4 Zeichen des HASH (nicht des Keys!)
  // Format: sk-ant-****abcd
  const prefix = keyHash.substring(0, 7);
  const suffix = keyHash.slice(-4);
  return `${prefix}****${suffix}`;
}

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

    console.log('🔑 Fetching API Keys from DB...');

    // Fetch Keys mit aggregierten Stats
    // WICHTIG: Prisma generiert snake_case, wir mappen zu camelCase
    const rawKeys: any[] = await prisma.$queryRaw`
      SELECT 
        ak.id,
        ak.provider,
        ak.name,
        ak."keyHash" as key_hash,
        ak.is_active,
        ak.created_at,
        ak.last_used_at,
        ak.monthly_limit,
        COALESCE(COUNT(aul.id), 0) as total_calls,
        COALESCE(SUM(aul.total_cost), 0) as total_cost
      FROM api_keys ak
      LEFT JOIN api_usage_logs aul ON ak.id = aul.api_key_id
        AND aul.created_at >= DATE_TRUNC('month', CURRENT_DATE)
      GROUP BY ak.id, ak.provider, ak.name, ak."keyHash", ak.is_active, ak.created_at, ak.last_used_at, ak.monthly_limit
      ORDER BY ak.created_at DESC
    `;

    console.log(`✅ Gefunden: ${rawKeys.length} Keys`);

    // Map zu Frontend-Format
    const keys = rawKeys.map((key) => ({
      id: key.id,
      provider: key.provider,
      name: key.name,
      keyMasked: maskApiKey(key.key_hash), // MASKIERT, nicht entschlüsselt
      isActive: key.is_active,
      calls: Number(key.total_calls) || 0,
      monthlyCost: parseFloat(key.total_cost) || 0,
      lastUsedAt: key.last_used_at 
        ? new Date(key.last_used_at).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Nie'
    }));

    return NextResponse.json({ keys });

  } catch (error) {
    console.error('❌ API Keys Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

