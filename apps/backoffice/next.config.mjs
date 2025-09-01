/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // WICHTIG für Docker!
  experimental: {
    outputFileTracingRoot: new URL('../../', import.meta.url).pathname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com'
      },
      {
        protocol: 'https', 
        hostname: '**.cloudfront.net'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000'
      }
    ]
  },
  // Für App Runner wichtig
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
