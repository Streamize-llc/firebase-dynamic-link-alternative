import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        destination: '/api/apple-app-site-association'
      },
      {
        source: '/.well-known/assetlinks.json',
        destination: '/api/assetlinks.json'
      }
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
