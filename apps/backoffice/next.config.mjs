/** @type {import('next').NextConfig} */
const nextConfig = {
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
  }
};

export default nextConfig;
