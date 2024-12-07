import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Add fallback for 'fs' module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      'babel-runtime': false,
    };

    return config;
  },
  transpilePackages: ['@babel/standalone'],
};

export default nextConfig;