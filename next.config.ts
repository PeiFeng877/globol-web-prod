import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // [SEO-ISSUE#002] 明确禁止尾斜杠，防止 Next.js 升级后默认行为漂移
  // 尾斜杠 URL 会触发 308 重定向，导致 Google 不建立索引
  trailingSlash: false,

  // 显式开启 HTTP 响应压缩
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'globol.im',
      },
      {
        protocol: 'https',
        hostname: 'globol-cms.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Redirects for legacy URLs
  async redirects() {
    return [
      {
        source: '/date/:slug*',
        destination: '/date-ideas/:slug*',
        permanent: true,
      },
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

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
