import { NextResponse } from 'next/server'

/**
 * Force Session Refresh
 * Instruiert Client zum Re-Login
 */
export async function GET() {
  return NextResponse.json({
    message: 'Session refresh required',
    instructions: [
      '1. Logout via /api/auth/signout',
      '2. Clear browser cookies',
      '3. Login again',
      '4. New JWT token will contain role and permissions'
    ],
    reason: 'JWT token was created before role/permissions were added to callbacks',
    logoutUrl: '/api/auth/signout'
  })
}

