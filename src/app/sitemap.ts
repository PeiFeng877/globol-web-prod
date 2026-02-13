
import type { MetadataRoute } from "next";
import { getAllArticles } from '@/lib/content';
import { locales } from '@/i18n/settings';
import { BASE_URL } from '@/lib/constants';
import { profiles, getCountries } from '@/data/profiles';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles('en');
  const staticPages = ['about', 'contact', 'privacy', 'terms'];

  // Helper to ensure trailing slash
  const withSlash = (url: string) => url.endsWith('/') ? url : `${url}/`;

  // 1. Generate article URLs
  const articleUrls = articles.flatMap(article =>
    locales.map(locale => ({
      url: locale === 'en'
        ? withSlash(`${BASE_URL}/date-ideas/${article.slug}`)
        : withSlash(`${BASE_URL}/${locale}/date-ideas/${article.slug}`),
      lastModified: new Date(article.publishedAt),
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries([
          ['x-default', withSlash(`${BASE_URL}/date-ideas/${article.slug}`)],
          ...locales.map(loc => [
            loc,
            loc === 'en'
              ? withSlash(`${BASE_URL}/date-ideas/${article.slug}`)
              : withSlash(`${BASE_URL}/${loc}/date-ideas/${article.slug}`)
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
        url: withSlash(`${BASE_URL}${localizedPath}`),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries([
            ['x-default', withSlash(`${BASE_URL}/${page}`)],
            ...locales.map((loc) => [
              loc,
              loc === 'en'
                ? withSlash(`${BASE_URL}/${page}`)
                : withSlash(`${BASE_URL}/${loc}/${page}`),
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
          url: withSlash(fullUrl),
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority,
          alternates: {
            languages: Object.fromEntries([
              ['x-default', withSlash(`${BASE_URL}${urlPath}`)],
              ...locales.map(loc => [
                loc,
                loc === 'en' ? withSlash(`${BASE_URL}${urlPath}`) : withSlash(`${BASE_URL}/${loc}${urlPath}`)
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
        url: withSlash(fullUrl),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries([
            ['x-default', withSlash(`${BASE_URL}${urlPath}`)],
            ...locales.map(loc => [
              loc,
              loc === 'en' ? withSlash(`${BASE_URL}${urlPath}`) : withSlash(`${BASE_URL}/${loc}${urlPath}`)
            ])
          ])
        }
      };
    });
  });

  return [
    // Homepage
    ...locales.map(locale => ({
      url: locale === 'en' ? withSlash(BASE_URL) : withSlash(`${BASE_URL}/${locale}`),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: Object.fromEntries([
          ['x-default', withSlash(BASE_URL)],
          ...locales.map(loc => [
            loc,
            loc === 'en' ? withSlash(BASE_URL) : withSlash(`${BASE_URL}/${loc}`)
          ])
        ])
      }
    })),
    // Date ideas list
    ...locales.map(locale => ({
      url: locale === 'en'
        ? withSlash(`${BASE_URL}/date-ideas`)
        : withSlash(`${BASE_URL}/${locale}/date-ideas`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries([
          ['x-default', withSlash(`${BASE_URL}/date-ideas`)],
          ...locales.map(loc => [
            loc,
            loc === 'en'
              ? withSlash(`${BASE_URL}/date-ideas`)
              : withSlash(`${BASE_URL}/${loc}/date-ideas`)
          ])
        ])
      }
    })),
    ...staticPageUrls,
    ...datingUrls,
    ...profileUrls,
  ];
}

