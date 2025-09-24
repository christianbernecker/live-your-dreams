import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Middleware läuft nur für authentifizierte Routen
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Öffentliche Routen
        if (req.nextUrl.pathname.startsWith('/login')) return true;
        if (req.nextUrl.pathname === '/') return true;
        if (req.nextUrl.pathname.startsWith('/api/auth')) return true;
        
        // Geschützte Routen benötigen Token
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
};