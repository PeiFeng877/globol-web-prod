import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'globol.im',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },

  // Redirects for legacy URLs
  async redirects() {
    return [
      // Redirect old /date routes to /date-ideas
      {
        source: '/date/:slug*',
        destination: '/date-ideas/:slug*',
        permanent: true, // 301 redirect
      },
      // Legal pages redirect to CDN (single source of truth)
      {
        source: '/privacy',
        destination: 'https://cdn.globol.im/term/privacy.html',
        permanent: false,
      },
      {
        source: '/terms',
        destination: 'https://cdn.globol.im/term/agreement.html',
        permanent: false,
      },
      {
        source: '/:locale/privacy',
        destination: 'https://cdn.globol.im/term/privacy.html',
        permanent: false,
      },
      {
        source: '/:locale/terms',
        destination: 'https://cdn.globol.im/term/agreement.html',
        permanent: false,
      },
    ];
  },
};

export default withPayload(nextConfig);
