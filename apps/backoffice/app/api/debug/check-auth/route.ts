import { auth } from '@/lib/nextauth'
import { NextResponse } from 'next/server'

/**
 * Debug: Complete Auth Check
 * Prüft Session, User, Role und gibt detaillierte Debug-Info
 */
export async function GET() {
  try {
    const session = await auth()
    
    // Detailed breakdown
    const debugInfo = {
      timestamp: new Date().toISOString(),
      hasSession: !!session,
      hasUser: !!session?.user,
      
      // User Details
      user: session?.user ? {
        email: session.user.email,
        name: session.user.name,
        id: session.user.id,
        image: session.user.image,
        role: session.user.role,
        isActive: session.user.isActive,
      } : null,

      // Admin Checks (simplified - role-based only)
      adminChecks: {
        roleField: session?.user?.role,
        roleIsAdmin: session?.user?.role === 'admin',
      },
      
      // What Sidebar should see
      sidebarLogic: {
        isAdmin: session?.user?.role === 'admin',
        shouldShowAdminMenuItem: session?.user?.role === 'admin',
      },
      
      // Full session (for debugging)
      fullSession: session
    }
    
    return NextResponse.json(debugInfo, { status: 200 })
    
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

