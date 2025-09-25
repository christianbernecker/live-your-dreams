import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js benötigt diese für Development
    "style-src 'self' 'unsafe-inline' https://designsystem.liveyourdreams.online",
    "img-src 'self' data: https://designsystem.liveyourdreams.online",
    "font-src 'self' https://designsystem.liveyourdreams.online",
    "connect-src 'self' https://api.vercel.com",
    "frame-ancestors 'none'",
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)

  // CORS für API Routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const allowedOrigins = [
      'http://localhost:3001',
      'https://backoffice.liveyourdreams.online',
      'https://backoffice-plk35u2yv-christianberneckers-projects.vercel.app'
    ]
    
    const origin = request.headers.get('origin')
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Middleware für alle Requests außer:
     * - API routes die mit /api/auth beginnen (NextAuth)
     * - Static files (_next/static)
     * - Images, favicon etc.
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
