/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Article slugs + locales
 * OUTPUT: MetadataRoute.Sitemap
 * POS: App Router SEO
 * CONTRACT: Builds multi-locale sitemap entries for pages and articles.
 * 职责: 生成多语言站点地图并标注 alternates。
 */
import type { MetadataRoute } from "next";
import { getAllArticles } from '@/lib/content';
import { locales } from '@/i18n/settings';
import { BASE_URL } from '@/lib/constants';
import { profiles, getCountries } from '@/data/profiles';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles('en');
  const staticPages = ['about', 'contact', 'privacy', 'terms'];
  
  // 1. Generate article URLs
  const articleUrls = articles.flatMap(article => 
    locales.map(locale => ({
      url: locale === 'en' 
        ? `${BASE_URL}/date-ideas/${article.slug}`
        : `${BASE_URL}/${locale}/date-ideas/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries([
          ['x-default', `${BASE_URL}/date-ideas/${article.slug}`],
          ...locales.map(loc => [
            loc,
            loc === 'en' 
              ? `${BASE_URL}/date-ideas/${article.slug}`
              : `${BASE_URL}/${loc}/date-ideas/${article.slug}`
          ])
        ])
      }
    }))
  );

  // 2. Static Pages
  const staticPageUrls = staticPages.flatMap((page) =>
    locales.map((locale) => {
      const localizedPath = locale === 'en' ? `/${page}` : `/${locale}/${page}`;

      return {
        url: `${BASE_URL}${localizedPath}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries([
            ['x-default', `${BASE_URL}/${page}`],
            ...locales.map((loc) => [
              loc,
              loc === 'en'
                ? `${BASE_URL}/${page}`
                : `${BASE_URL}/${loc}/${page}`,
            ]),
          ]),
        },
      };
    })
  );

  // 3. International Dating - Main & Filters (Gender + Country)
  const datingUrls = (() => {
    const genders = ['man', 'woman'];
    const countries = getCountries();
    const combinations: { urlPath: string; priority: number }[] = [
      // Main Listing
      { urlPath: '/international-dating', priority: 0.9 }
    ];

    // Gender Filter
    genders.forEach(gender => {
      combinations.push({ urlPath: `/international-dating/${gender}`, priority: 0.8 });
      
      // Gender + Country Filter
      countries.forEach(country => {
        combinations.push({ urlPath: `/international-dating/${gender}/${country}`, priority: 0.8 });
      });
    });

    return combinations.flatMap(({ urlPath, priority }) => 
      locales.map(locale => {
        const fullUrl = locale === 'en' ? `${BASE_URL}${urlPath}` : `${BASE_URL}/${locale}${urlPath}`;
        
        return {
          url: fullUrl,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority,
          alternates: {
            languages: Object.fromEntries([
              ['x-default', `${BASE_URL}${urlPath}`],
              ...locales.map(loc => [
                loc,
                loc === 'en' ? `${BASE_URL}${urlPath}` : `${BASE_URL}/${loc}${urlPath}`
              ])
            ])
          }
        };
      })
    );
  })();

  // 4. Dating Profiles (Detail Pages)
  const profileUrls = profiles.flatMap(profile => {
    const nameSlug = profile.name.toLowerCase().replace(/\s+/g, '-');
    return locales.map(locale => {
      const urlPath = `/international-dating/profile/${nameSlug}`;
      const fullUrl = locale === 'en' ? `${BASE_URL}${urlPath}` : `${BASE_URL}/${locale}${urlPath}`;
      
      return {
        url: fullUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries([
            ['x-default', `${BASE_URL}${urlPath}`],
            ...locales.map(loc => [
              loc,
              loc === 'en' ? `${BASE_URL}${urlPath}` : `${BASE_URL}/${loc}${urlPath}`
            ])
          ])
        }
      };
    });
  });

  return [
    // Homepage
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
    // Date ideas list
    ...locales.map(locale => ({
      url: locale === 'en' 
        ? `${BASE_URL}/date-ideas`
        : `${BASE_URL}/${locale}/date-ideas`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries([
          ['x-default', `${BASE_URL}/date-ideas`],
          ...locales.map(loc => [
            loc,
            loc === 'en' 
              ? `${BASE_URL}/date-ideas`
              : `${BASE_URL}/${loc}/date-ideas`
          ])
        ])
      }
    })),
    ...staticPageUrls,
    ...datingUrls,
    ...profileUrls,
  ];
}
