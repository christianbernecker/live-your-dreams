import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { auth } from '@/lib/auth' // Disabled for Edge Runtime compatibility

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/api/media',
  '/api/posts',
  '/api/users',
  '/api/roles'
]

// Routes that redirect to dashboard if already authenticated
const authRoutes = [
  '/login',
  '/auth/signin',
  '/auth/signup'
]

// Admin-only routes
const adminRoutes = [
  '/dashboard/users',
  '/dashboard/roles',
  '/dashboard/settings',
  '/api/users',
  '/api/roles'
]

// API routes that need special handling
const apiRoutes = [
  '/api/auth',
  '/api/media/upload'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API auth routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/lyd-logo')
  ) {
    return NextResponse.next()
  }

  try {
    // Get session - simplified for Edge Runtime
    // const session = await auth()
    const session = null // Temporary disable for Edge Runtime
    const isAuthenticated = false // !!session?.user
    const isAdmin = false // session?.user?.role === 'admin'

    // Handle authentication routes
    if (authRoutes.some(route => pathname.startsWith(route))) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // Handle protected routes
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!isAuthenticated) {
        const url = new URL('/login', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }

      // Check admin routes
      if (adminRoutes.some(route => pathname.startsWith(route)) && !isAdmin) {
        return NextResponse.redirect(new URL('/dashboard?error=access_denied', request.url))
      }

      return NextResponse.next()
    }

    // Handle API routes
    if (apiRoutes.some(route => pathname.startsWith(route))) {
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      // Admin API routes
      if (adminRoutes.some(route => pathname.startsWith(route)) && !isAdmin) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      return NextResponse.next()
    }

    // Root route - redirect based on auth status
    if (pathname === '/') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    return NextResponse.next()

  } catch (error) {
    console.error('Middleware error:', error)
    
    // On error, redirect to login for protected routes
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login?error=session_error', request.url))
    }
    
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}