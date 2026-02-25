/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-09 支持 15 语种（含 Feed 与 Sidebar 翻译）；变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: params: { locale, name }
 * OUTPUT: Profile detail page (Instagram Web-style)
 * POS: App Router Page
 * CONTRACT: Renders single-column feed on left, user sidebar on right with localized data.
 * 职责: 国际交友人物详情页，Instagram 网页端风格单列 Feed（全语种支持）。
 */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  profiles,
  getProfileDetailView,
  toProfileView,
  type ProfileFeedTone,
  type UserProfileView,
  type LocalizedText
} from '@/data/profiles';
import { locales } from '@/i18n/settings';
import { getDictionary } from '@/i18n/server';
import ProfileChatLauncher from '@/components/features/dating/chat/ProfileChatLauncher';
import { formatRelativeTime } from '@/lib/date';
import { BASE_URL } from '@/lib/constants';


interface PageProps {
  params: Promise<{
    locale: string;
    name: string;
  }>;
}

export const revalidate = 172800;

const nameToSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const findProfileBySlug = (slug: string) => {
  return profiles.find((p) => nameToSlug(p.name) === slug.toLowerCase());
};

const toneGradients: Record<ProfileFeedTone, string> = {
  sunrise: 'from-rose-200 via-amber-100 to-orange-100',
  ocean: 'from-sky-200 via-cyan-100 to-emerald-100',
  citrus: 'from-lime-200 via-yellow-100 to-amber-100',
  dusk: 'from-indigo-200 via-purple-100 to-pink-100'
};

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    profiles.map((profile) => ({
      locale,
      name: nameToSlug(profile.name)
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, name } = await params;
  const t = getDictionary(locale);
  const profile = findProfileBySlug(name);


  if (!profile) return { title: 'Profile Not Found | Globol' };

  const profileView = toProfileView(profile, locale as keyof LocalizedText);

  const title = `${profileView.name} ${t.common.from || 'from'} ${profileView.city} - ${t.common.internationalDating} | Globol`;
  const description = `${profileView.name}, ${profileView.age} - ${profileView.bio}. ${t.common.internationalDating} Globol.`;

  const slug = nameToSlug(profile.name);
  const canonicalPath = `${locale === 'en' ? '' : '/' + locale}/international-dating/profile/${slug}`;
  const avatarUrl = profile.avatar.startsWith('http') ? profile.avatar : `${BASE_URL}${profile.avatar}`;

  const languages = Object.fromEntries([
    ['x-default', `${BASE_URL}/international-dating/profile/${slug}`],
    ...locales.map(loc => [
      loc,
      `${BASE_URL}${loc === 'en' ? '' : '/' + loc}/international-dating/profile/${slug}`
    ])
  ]);

  return {
    title, description,
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages
    },
    openGraph: {
      title, description, url: `${BASE_URL}${canonicalPath}`, siteName: 'Globol',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'profile',
      images: [{ url: avatarUrl }]
    },
    twitter: { card: 'summary', title, description, images: [avatarUrl] }
  };
}

const FeedPost = ({ item, profile, locale, isFirst = false }: { item: Record<string, unknown> & { timestamp: string, caption: string, image?: string, tone?: string, type?: string }; profile: UserProfileView; locale: string; isFirst?: boolean; }) => {
  const profilePath = locale === 'en'
    ? `/international-dating/profile/${nameToSlug(profile.name)}`
    : `/${locale}/international-dating/profile/${nameToSlug(profile.name)}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <Link href={profilePath} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-gray-100">
            <Image src={profile.avatar || '/assets/placeholder-user.jpg'} alt={profile.name} fill className="object-cover" sizes="36px" />
          </div>
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-sm tracking-tight">{profile.name}</h3>
          </div>
        </Link>
        <div className="text-gray-400 text-[11px] uppercase tracking-[0.12em]">
          {formatRelativeTime(item.timestamp, locale)}
        </div>
      </div>
      <div className="px-5 pb-4">
        <p className="text-sm leading-7 text-gray-700 whitespace-pre-line">{item.caption}</p>
      </div>
      <div className="aspect-[4/3] relative mt-1">
        {item.image ? (
          <Image src={item.image} alt={`${profile.name} post`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 470px" priority={isFirst} />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${toneGradients[item.tone as ProfileFeedTone]}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500/20 text-xs font-medium uppercase tracking-widest">{item.type}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SuggestedUser = ({ profile, locale, viewText }: { profile: UserProfileView; locale: string; viewText: string }) => {
  const profilePath = locale === 'en' ? `/international-dating/profile/${nameToSlug(profile.name)}` : `/${locale}/international-dating/profile/${nameToSlug(profile.name)}`;
  return (
    <Link href={profilePath} className="flex items-center justify-between py-2 group">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image src={profile.avatar || '/assets/placeholder-user.jpg'} alt={profile.name} fill className="object-cover" sizes="40px" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold group-hover:underline">{profile.name}</span>
          <span className="text-xs text-gray-500">{profile.city}</span>
        </div>
      </div>
      <span className="text-sky-500 text-xs font-semibold hover:text-sky-600">{viewText}</span>
    </Link>
  );
};

export default async function ProfileDetailPage({ params }: PageProps) {
  const { locale, name } = await params;
  const t = getDictionary(locale);
  const profile = findProfileBySlug(name);
  if (!profile) notFound();

  const profileView: UserProfileView = toProfileView(profile, locale as keyof LocalizedText);
  const detail = getProfileDetailView(profile, locale as keyof LocalizedText);
  const otherProfiles = profiles.filter((p) => p.id !== profile.id).slice(0, 5).map((p) => toProfileView(p, locale as keyof LocalizedText));

  const homeLink = locale === 'en' ? '/' : `/${locale}`;
  const datingLink = locale === 'en' ? '/international-dating' : `/${locale}/international-dating`;
  const avatarUrl = profile.avatar.startsWith('http') ? profile.avatar : `${BASE_URL}${profile.avatar}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: profileView.name,
        description: profileView.bio,
        image: avatarUrl,
        address: { '@type': 'PostalAddress', addressLocality: profileView.city, addressCountry: profileView.countryDisplay }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.common.home || 'Home', item: `${BASE_URL}${homeLink}` },
          { '@type': 'ListItem', position: 2, name: t.common.internationalDating || 'International Dating', item: `${BASE_URL}${datingLink}` },
          { '@type': 'ListItem', position: 3, name: profileView.name || 'Profile', item: `${BASE_URL}${locale === 'en' ? '' : '/' + locale}/international-dating/profile/${nameToSlug(profile.name)}` }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="max-w-[470px] mx-auto w-full">
            <div className="mb-6 lg:hidden">
              <ProfileChatLauncher profileId={profile.id} profileName={profileView.name} locale={locale} />
            </div>
            {detail.feed.map((item, index) => (
              <FeedPost key={item.id} item={item} profile={profileView} locale={locale} isFirst={index === 0} />
            ))}
          </div>
          <aside className="hidden lg:block space-y-6 sticky top-24 h-fit">
            <div className="flex items-center justify-between">
              <Link href={`${BASE_URL}${locale === 'en' ? '' : '/' + locale}/international-dating/profile/${nameToSlug(profile.name)}`} className="flex items-center gap-3 group">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image src={profileView.avatar || '/assets/placeholder-user.jpg'} alt={profileView.name} fill className="object-cover" sizes="56px" priority />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-semibold text-sm group-hover:underline">{profileView.name}</h1>
                  <span className="text-gray-500 text-sm truncate max-w-[160px]">{detail.headline}</span>
                </div>
              </Link>
              <ProfileChatLauncher profileId={profile.id} profileName={profileView.name} locale={locale} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-gray-500 text-sm font-semibold">{t.dating.recommendedMembers}</h2>
                <Link href={datingLink} className="text-xs font-semibold hover:text-gray-600">{t.common.readMore}</Link>
              </div>
              <div className="space-y-1">
                {otherProfiles.map((p) => (
                  <SuggestedUser key={p.id} profile={p} locale={locale} viewText={t.common.readMore} />
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400 pt-4"><p>© 2026 GLOBOL</p></div>
          </aside>
        </div>
      </main>
    </div>
  );
}
