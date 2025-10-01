import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Build-Konfiguration
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Vercel Deployment optimiert
  output: 'standalone',
  
  // Experimentelle Features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
