/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: None
 * OUTPUT: MetadataRoute.Robots
 * POS: App Router SEO
 * CONTRACT: Defines crawler rules and sitemap location.
 * 职责: 提供全站 robots 规则与索引入口。
 */
import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { BASE_URL } from '@/lib/constants';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Block indexing for dev/staging subdomains
  if (host.includes('dev.')) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
