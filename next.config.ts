import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kbwitqhorolvidqrfyth.supabase.co',
        pathname: '/storage/v1/object/public/cc59/**',
      },
    ],
  },
};

export default nextConfig;
