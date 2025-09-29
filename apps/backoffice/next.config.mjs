/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'designsystem.liveyourdreams.online', 'blob.vercel-storage.com'],
  },
  // Performance Optimizations + Node.js Runtime for bcrypt
  experimental: {
    optimizePackageImports: ['react-icons'],
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Security
  poweredByHeader: false,
  // Redirects für bessere UX
  async redirects() {
    return [
      // Redirect loop entfernt - war /login -> /
      // Middleware handled jetzt alle Auth-Redirects
    ]
  },
  // Headers für Security (zusätzlich zu middleware.ts)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
  // Disable ESLint during builds for faster iteration
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig