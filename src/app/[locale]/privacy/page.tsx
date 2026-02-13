/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: params: { locale }
 * OUTPUT: Privacy page
 * POS: App Router Page
 * CONTRACT: Renders localized privacy policy content.
 * 职责: 隐私政策静态页面（Markdown 驱动）。
 */
import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/server';
import { locales } from '@/i18n/settings';
import { getLegalContent } from '@/lib/content';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const ogImage = '/assets/article-hero.avif';
  const title = `${t.footer.privacy} - Globol`;
  const canonicalPath = locale === 'en' ? '/privacy' : `/${locale}/privacy`;

  return {
    title,
    description: t.seo.privacyDescription,
    openGraph: {
      title,
      description: t.seo.privacyDescription,
      type: 'article',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t.seo.privacyDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': '/privacy',
        'en': '/privacy',
        'zh': '/zh/privacy',
      },
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }));
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const contentHtml = await getLegalContent(locale, 'privacy');

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:px-8">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8">
        {t.privacy.title}
      </h1>
      <div className="p-8 md:p-12 bg-white/80 rounded-3xl border border-gray-100 shadow-sm">
        <div
          className="prose prose-gray max-w-none prose-h2:mt-10 prose-h3:mt-8 prose-h4:mt-6"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}
