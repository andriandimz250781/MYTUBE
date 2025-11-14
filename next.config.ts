import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_YOUTUBE_API_KEYS_1: process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_1,
    NEXT_PUBLIC_YOUTUBE_API_KEYS_2: process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_2,
    NEXT_PUBLIC_YOUTUBE_API_KEYS_3: process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_3,
    NEXT_PUBLIC_YOUTUBE_API_KEYS_4: process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_4,
    NEXT_PUBLIC_YOUTUBE_API_KEYS_5: process.env.NEXT_PUBLIC_YOUTUBE_API_KEYS_5,
  },
};

export default nextConfig;
