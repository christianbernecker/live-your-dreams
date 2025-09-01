import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { IS24Client } from '@/lib/integrations/is24-client';
import { rateLimit } from '@/lib/api/rate-limit';

/**
 * GET /api/integrations/is24/auth
 * 
 * Initiiert IS24 OAuth Flow
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = new IS24Client();
    const state = `${session.user.id}-${Date.now()}`;
    const authUrl = client.getAuthorizationUrl(state);

    // State für Verification speichern
    // In production: Redis oder Database
    // Für Demo: In-Memory (nicht production-ready)

    return NextResponse.json({
      authUrl,
      state
    });

  } catch (error) {
    console.error('IS24 auth initiation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/integrations/is24/auth
 * 
 * Disconnects IS24 Integration
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Remove IS24 tokens from user record
    await db.user.update({
      where: { id: session.user.id },
      data: {
        // TODO: Add is24AccessToken, is24RefreshToken fields to User model
        // is24AccessToken: null,
        // is24RefreshToken: null,
        // is24ConnectedAt: null
      }
    });

    return NextResponse.json({
      message: 'IS24 integration disconnected successfully'
    });

  } catch (error) {
    console.error('IS24 disconnect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
