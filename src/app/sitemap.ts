
import type { MetadataRoute } from "next";
import { getAllArticles } from '@/lib/content';
import { locales } from '@/i18n/settings';
import { BASE_URL } from '@/lib/constants';
import { profiles, getCountries } from '@/data/profiles';

// 强制动态渲染, 绕过 CDN 陈旧缓存
export const dynamic = 'force-dynamic';

// ────────────────────────────────────────────────────────────
// URL 构建工具: 统一不带尾斜杠, 与 Next.js trailingSlash:false 对齐
// ────────────────────────────────────────────────────────────
const localizedUrl = (path: string, locale: string) =>
  locale === 'en' ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;

const hreflangMap = (path: string) =>
  Object.fromEntries([
    ['x-default', `${BASE_URL}${path}`],
    ...locales.map(loc => [loc, localizedUrl(path, loc)])
  ]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles('en');
  const staticPages = ['about', 'contact', 'date-idea-generator'];

  // 1. Article URLs
  const articleUrls = articles.flatMap(article => {
    const path = `/date-ideas/${article.slug}`;
    return locales.map(locale => ({
      url: localizedUrl(path, locale),
      lastModified: new Date(article.publishedAt),
      priority: 0.8,
      alternates: { languages: hreflangMap(path) }
    }));
  });

  // 2. Static Pages
  const staticPageUrls = staticPages.flatMap(page => {
    const path = `/${page}`;
    return locales.map(locale => ({
      url: localizedUrl(path, locale),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: { languages: hreflangMap(path) }
    }));
  });

  // 3. International Dating - Main & Filters (Gender + Country)
  const datingUrls = (() => {
    const genders = ['man', 'woman'];
    const countries = getCountries();
    const paths: { path: string; priority: number }[] = [
      { path: '/international-dating', priority: 0.9 }
    ];

    genders.forEach(gender => {
      paths.push({ path: `/international-dating/${gender}`, priority: 0.8 });
      countries.forEach(country => {
        paths.push({ path: `/international-dating/${gender}/${country}`, priority: 0.8 });
      });
    });

    return paths.flatMap(({ path, priority }) =>
      locales.map(locale => ({
        url: localizedUrl(path, locale),
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority,
        alternates: { languages: hreflangMap(path) }
      }))
    );
  })();

  // 4. Dating Profiles (Detail Pages)
  const profileUrls = profiles.flatMap(profile => {
    const nameSlug = profile.name.toLowerCase().replace(/\s+/g, '-');
    const path = `/international-dating/profile/${nameSlug}`;
    return locales.map(locale => ({
      url: localizedUrl(path, locale),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: hreflangMap(path) }
    }));
  });

  // 5. Homepage & Date Ideas List
  return [
    ...locales.map(locale => ({
      url: locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries([
          ['x-default', BASE_URL],
          ...locales.map(loc => [
            loc,
            loc === 'en' ? BASE_URL : `${BASE_URL}/${loc}`
          ])
        ])
      }
    })),
    ...locales.map(locale => ({
      url: localizedUrl('/date-ideas', locale),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: { languages: hreflangMap('/date-ideas') }
    })),
    ...staticPageUrls,
    ...datingUrls,
    ...profileUrls,
    ...articleUrls,
  ];
}

