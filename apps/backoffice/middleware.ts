import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.amazonaws.com https://*.cloudfront.net",
  "font-src 'self' data:",
  "connect-src 'self' https://*.upstash.io https://*.amazonaws.com",
  "frame-ancestors 'none'",
  "base-uri 'self'"
].join('; ');

export function middleware(_: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
