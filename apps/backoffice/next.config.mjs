/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'designsystem.liveyourdreams.online'],
  },
  // Performance Optimizations
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  // Security
  poweredByHeader: false,
  // Redirects für bessere UX
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: false,
      },
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
}

export default nextConfig