import { auth } from '@/lib/nextauth'
import { NextResponse } from 'next/server'

/**
 * Debug Endpoint: Session Details
 * GET /api/debug/session
 */
export async function GET() {
  try {
    const session = await auth()
    
    return NextResponse.json({
      hasSession: !!session,
      sessionData: session,
      user: session?.user || null,
      role: session?.user?.role || 'NO_ROLE',
      permissions: session?.user?.permissions || [],
      email: session?.user?.email || 'NO_EMAIL',
      isActive: session?.user?.isActive,
      // Check Admin Status
      checks: {
        hasUser: !!session?.user,
        hasRole: !!session?.user?.role,
        roleValue: session?.user?.role,
        isAdminRole: session?.user?.role === 'admin',
        hasPermissions: !!session?.user?.permissions,
        permissionCount: session?.user?.permissions?.length || 0
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch session',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

