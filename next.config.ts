import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // [SEO-ISSUE#002] 明确禁止尾斜杠，防止 Next.js 升级后默认行为漂移
  // 尾斜杠 URL 会触发 308 重定向，导致 Google 不建立索引
  trailingSlash: false,

  // 显式开启 HTTP 响应压缩（防止 withPayload 包裹后默认行为漂移）
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    // 图片 CDN 边缘节点最大缓存时间：1 年，减少重复回源
    minimumCacheTTL: 31536000,
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
