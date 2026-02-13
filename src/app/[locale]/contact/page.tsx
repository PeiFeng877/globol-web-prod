/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: params: { locale }
 * OUTPUT: Contact page
 * POS: App Router Page
 * CONTRACT: Renders localized contact information and CTA.
 * 职责: 联系页与下载转化入口。
 */
import React from 'react';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/server';
import { locales } from '@/i18n/settings';
import { Mail } from 'lucide-react';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const ogImage = '/assets/article-hero.avif';
  const title = `${t.footer.contact} - Globol`;
  const canonicalPath = locale === 'en' ? '/contact/' : `/${locale}/contact/`;

  return {
    title,
    description: t.seo.contactDescription,
    openGraph: {
      title,
      description: t.seo.contactDescription,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t.seo.contactDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': '/contact/',
        'en': '/contact/',
        'zh': '/zh/contact/',
      },
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }));
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:px-8 text-center">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8">
        {t.contact.title}
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        {t.contact.intro}
      </p>

      <div className="inline-flex flex-col items-center justify-center p-12 bg-gray-50 rounded-3xl border border-gray-100">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-yellow-500">
          <Mail size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.contact.emailTitle}</h3>
        <p className="text-gray-500 mb-6">{t.contact.emailDesc}</p>
        <a
          href="mailto:hi@globol.im"
          className="text-2xl font-bold text-black hover:text-yellow-600 transition-colors underline decoration-2 underline-offset-4"
        >
          hi@globol.im
        </a>
      </div>
    </div>
  );
}
