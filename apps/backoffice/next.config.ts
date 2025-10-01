import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Skip pre-rendering of error pages to avoid React context issues
    optimizePackageImports: ['react', 'react-dom'],
  },
  // Don't fail build on pre-render errors for _error pages
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
