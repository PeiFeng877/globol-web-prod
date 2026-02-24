/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: params: { locale, slug? }
 * OUTPUT: International dating listing page
 * POS: App Router Page
 * CONTRACT: Renders profile grid with optional gender/country filtering, detail links, and SEO metadata.
 * 职责: 国际交友列表页与筛选路由入口。
 */
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { profiles, getCountries, UserProfileView, toProfileView, type LocalizedText } from '@/data/profiles';
import { ProfileGrid } from '@/components/features/dating/ProfileGrid';
import { getDictionary } from '@/i18n/server';
import { locales } from '@/i18n/settings';
import { BASE_URL } from '@/lib/constants';
Sands

interface PageProps {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
}

export const revalidate = 172800;

// 1. Define Valid Paths for SSG
export async function generateStaticParams() {
  const genders = Array.from(new Set(profiles.map((profile) => profile.gender)));
  const countries = getCountries();
  const genderCountryPairs = new Set(
    profiles.map((profile) => `${profile.gender}/${profile.country}`)
  );

  const paths = [];

  for (const locale of locales) {
    paths.push({ locale, slug: [] });
    for (const gender of genders) {
      paths.push({ locale, slug: [gender] });
      for (const country of countries) {
        if (genderCountryPairs.has(`${gender}/${country}`)) {
          paths.push({ locale, slug: [gender, country] });
        }
      }
    }
  }

  return paths;
}

// 2. Metadata Generator
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const gender = slug?.[0];
  const country = slug?.[1];


  // Construct Canonical URL
  const langPrefix = locale === 'en' ? '' : `/${locale}`;
  let path = `${langPrefix}/international-dating`;
  if (gender) path += `/${gender}`;
  if (country) path += `/${country}`;

  let title = t.seo.datingTitle;
  const description = t.seo.datingDescription;

  if (gender && !country) {
    const genderText = gender === 'man' ? t.common.men : t.common.women;
    title = `${t.common.meet || 'Meet'} ${genderText} - ${t.common.internationalDating} | Globol`;
  } else if (gender && country) {
    const sampleProfile = profiles.find(p => p.country === country);
    const countryName = sampleProfile?.countryDisplay?.[locale as keyof LocalizedText] || country;
    const genderText = gender === 'man' ? t.common.men : t.common.women;
    title = `${t.common.dating || 'Dating'} ${genderText} ${t.common.from || 'from'} ${countryName} - ${t.common.internationalDating} | Globol`;
  }

  const filterSuffix = `${gender ? '/' + gender : ''}${country ? '/' + country : ''}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages: Object.fromEntries([
        ['x-default', `${BASE_URL}/international-dating${filterSuffix}`],
        ...locales.map(loc => [
          loc,
          `${BASE_URL}${loc === 'en' ? '' : '/' + loc}/international-dating${filterSuffix}`
        ])
      ])
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
      siteName: 'Globol',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function InternationalDatingPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);

  const gender = slug?.[0];
  const country = slug?.[1];
  const langKey = locale as keyof LocalizedText;

  // 3. Filter Logic
  let filteredRawProfiles = profiles;

  if (gender) {
    if (!['man', 'woman'].includes(gender)) { return notFound(); }
    filteredRawProfiles = filteredRawProfiles.filter(p => p.gender === gender);
  }

  if (country) {
    const validCountries = getCountries();
    if (!validCountries.includes(country)) { return notFound(); }
    filteredRawProfiles = filteredRawProfiles.filter(p => p.country === country);
  }

  if (filteredRawProfiles.length === 0) {
    return notFound();
  }

  // 4. Transform Data
  const viewProfiles: UserProfileView[] = filteredRawProfiles.map(p => toProfileView(p, langKey));

  // 5. Titles & Text
  let pageTitle = t.common.internationalDating;

  if (gender && !country) {
    const genderText = gender === 'man' ? t.common.men : t.common.women;
    pageTitle = `${t.common.meet || 'Meet'} ${genderText}`;
  } else if (gender && country) {
    const countryName = viewProfiles[0]?.countryDisplay || country;
    const genderText = gender === 'man' ? t.common.men : t.common.women;
    pageTitle = `${genderText} ${t.common.from || 'from'} ${countryName}`;
  }

  const homeLink = locale === 'en' ? '/' : `/${locale}`;
  const datingLink = locale === 'en' ? '/international-dating' : `/${locale}/international-dating`;
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: t.common.home || 'Home',
      item: `${BASE_URL}${homeLink}`
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: t.common.internationalDating || 'International Dating',
      item: `${BASE_URL}${datingLink}`
    }
  ];

  if (gender) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: (gender === 'man' ? t.common.men : t.common.women) || (gender === 'man' ? 'Men' : 'Women'),
      item: `${BASE_URL}${datingLink}/${gender}`
    });
  }

  if (country) {
    const countryName = viewProfiles[0]?.countryDisplay || country;
    breadcrumbs.push({
      '@type': 'ListItem',
      position: gender ? 4 : 3,
      name: countryName || country,
      item: `${BASE_URL}${datingLink}${gender ? '/' + gender : ''}/${country}`
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
  };

  return (
    <div className="min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {pageTitle}
        </h1>
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          {t.common.join}
        </h2>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <ProfileGrid
          profiles={viewProfiles}
          profileBasePath={locale === 'en' ? '/international-dating/profile' : `/${locale}/international-dating/profile`}
          viewProfileText={t.common.readMore}
          seekingText={t.common.language}
          noProfilesTitle={t.notFound.title}
          noProfilesDesc={t.notFound.description}
        />
      </div>
    </div>
  );
}
