import type { NextConfig } from "next";
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

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
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
