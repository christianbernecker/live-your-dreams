import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.amazonaws.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.upstash.io https://*.amazonaws.com",
    "frame-ancestors 'none'",
    "base-uri 'self'"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=()'
};

export default withAuth(
  function middleware(req) {
    const response = NextResponse.next();
    
    // Add security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes (no auth required)
        if (pathname === '/') return true;
        if (pathname === '/login') return true;
        if (pathname.startsWith('/api/health')) return true;
        if (pathname.startsWith('/api/leads') && req.method === 'POST') return true; // Public lead submission
        
        // All other routes require authentication
        return !!token;
      }
    },
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/properties/:path*', 
    '/leads/:path*',
    '/media/:path*',
    '/api/properties/:path*',
    '/api/uploads/:path*',
    '/api/auth/:path*'
  ]
};
