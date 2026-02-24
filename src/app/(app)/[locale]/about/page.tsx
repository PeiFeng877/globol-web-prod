/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: params: { locale }
 * OUTPUT: About page
 * POS: App Router Page
 * CONTRACT: Renders localized brand narrative and value proposition.
 * 职责: 关于页品牌叙事展示。
 */
import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/server';
import { locales } from '@/i18n/settings';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export const revalidate = 172800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const ogImage = '/assets/article-hero.avif';
  const title = `${t.footer.aboutUs} - Globol`;

  return {
    title,
    description: t.seo.aboutDescription,
    openGraph: {
      title,
      description: t.seo.aboutDescription,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t.seo.aboutDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: locale === 'en' ? '/about' : `/${locale}/about`,
      languages: Object.fromEntries([
        ['x-default', '/about'],
        ...locales.map(loc => [loc, loc === 'en' ? '/about' : `/${loc}/about`])
      ])
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }));
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:px-8">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8">
        {t.about.title}
      </h1>
      <div className="prose prose-lg prose-gray max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          {t.about.intro1}
        </p>
        <p className="mb-6">
          {t.about.intro2}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">{t.about.missionTitle}</h2>
        <p className="mb-6">
          {t.about.missionDesc}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">{t.about.visionTitle}</h2>
        <p className="mb-6">
          {t.about.visionDesc}
        </p>
      </div>
    </div>
  );
}
