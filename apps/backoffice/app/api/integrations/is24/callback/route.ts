import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { IS24Client } from '@/lib/integrations/is24-client';

/**
 * OAuth Callback Schema
 */
const callbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
  error: z.string().optional()
});

/**
 * GET /api/integrations/is24/callback
 * 
 * IS24 OAuth Callback Handler
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Error from IS24?
    if (searchParams.get('error')) {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/settings/integrations?is24_error=${encodeURIComponent(error || 'unknown')}&description=${encodeURIComponent(errorDescription || '')}`
      );
    }

    // Validate callback parameters
    const callbackData = callbackSchema.parse({
      code: searchParams.get('code'),
      state: searchParams.get('state'),
      error: searchParams.get('error')
    });

    // Extract user ID from state
    const [userId] = callbackData.state.split('-');
    if (!userId) {
      throw new Error('Invalid state parameter');
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Exchange code for tokens
    const client = new IS24Client();
    const tokenResponse = await client.exchangeCodeForToken(callbackData.code);

    // Test the connection
    const userInfo = await client.getUserInfo();
    
    console.log('IS24 connection successful:', {
      userId: user.id,
      is24UserId: userInfo?.id,
      email: userInfo?.email
    });

    // Store tokens in database
    // TODO: Add these fields to User model in production
    /*
    await db.user.update({
      where: { id: userId },
      data: {
        is24AccessToken: tokenResponse.access_token,
        is24RefreshToken: tokenResponse.refresh_token,
        is24TokenExpiresAt: new Date(Date.now() + (tokenResponse.expires_in * 1000)),
        is24UserId: userInfo?.id,
        is24ConnectedAt: new Date()
      }
    });
    */

    // For demo: Just log success
    console.log('IS24 tokens received:', {
      hasAccessToken: !!tokenResponse.access_token,
      hasRefreshToken: !!tokenResponse.refresh_token,
      expiresIn: tokenResponse.expires_in
    });

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings/integrations?is24_connected=true`
    );

  } catch (error) {
    console.error('IS24 callback error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/settings/integrations?is24_error=${encodeURIComponent(errorMessage)}`
    );
  }
}
