/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: params: { locale }
 * OUTPUT: Date ideas list page
 * POS: App Router Page
 * CONTRACT: Renders article grid with SEO metadata and ItemList schema.
 * 职责: 文章列表页与 SEO 列表结构化数据。
 * CHANGE: 2026-02-05 统一 JSON-LD 与 canonical URL
 */
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllArticles, ArticleData } from '@/lib/content';
import { getDictionary } from '@/i18n/server';
import { locales } from '@/i18n/settings';

const CARD_IMAGE_SIZES =
  "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  const ogImage = '/assets/article-hero.avif';
  const canonicalPath = locale === 'en' ? '/date-ideas/' : `/${locale}/date-ideas/`;

  return {
    title: t.common.dateIdeas,
    description: t.seo.dateIdeasDescription,
    openGraph: {
      title: t.common.dateIdeas,
      description: t.seo.dateIdeasDescription,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.common.dateIdeas,
      description: t.seo.dateIdeasDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalPath,
      languages: Object.fromEntries([
        ['x-default', '/date-ideas/'],
        ...locales.map(loc => [
          loc,
          loc === 'en' ? '/date-ideas/' : `/${loc}/date-ideas/`
        ])
      ])
    },
  };
}

export default async function DateListPage({ params }: PageProps) {
  const { locale } = await params;
  const articles = getAllArticles(locale);
  const t = getDictionary(locale);
  const canonicalBase = locale === 'en' ? 'https://www.globol.im' : `https://www.globol.im/${locale}`;
  const layoutPatterns: LayoutPattern[] = [
    {
      className: "pattern-a",
      items: [
        { area: "a", variant: "stacked" },
        { area: "b", variant: "overlay" },
        { area: "c", variant: "stacked" },
        { area: "d", variant: "split" },
        { area: "e", variant: "stacked" },
        { area: "f", variant: "stacked" },
        { area: "g", variant: "split" },
      ],
    },
    {
      className: "pattern-b",
      items: [
        { area: "a", variant: "split" },
        { area: "b", variant: "overlay" },
        { area: "c", variant: "stacked" },
        { area: "d", variant: "split" },
        { area: "e", variant: "stacked" },
        { area: "f", variant: "split" },
        { area: "g", variant: "stacked" },
      ],
    },
  ];
  const chunkSize = layoutPatterns[0].items.length;
  const chunks = Array.from({ length: Math.ceil(articles.length / chunkSize) }, (_, index) =>
    articles.slice(index * chunkSize, (index + 1) * chunkSize)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${canonicalBase}/date-ideas/${article.slug}`,
      name: article.title,
      image: article.heroImage,
      description: article.subtitle
    }))
  };

  return (
    <div className="min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.common.dateIdeas}</h1>
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t.common.moreDateIdeas}</h2>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-6">
        {chunks.map((chunk, chunkIndex) => {
          const pattern = layoutPatterns[chunkIndex % layoutPatterns.length];
          const usePattern = chunk.length === pattern.items.length;
          const gridClassName = usePattern
            ? `date-ideas-grid ${pattern.className}`
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

          return (
            <div key={`${chunkIndex}-${chunk.length}`} className={gridClassName}>
              {chunk.map((article, index) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  locale={locale}
                  layout={usePattern ? pattern.items[index] : undefined}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type CardVariant = "stacked" | "split" | "overlay";

interface CardLayout {
  area: string;
  variant: CardVariant;
}

interface LayoutPattern {
  className: string;
  items: CardLayout[];
}

function ArticleCard({
  article,
  locale,
  layout,
}: {
  article: Omit<ArticleData, 'contentHtml'>;
  locale: string;
  layout?: CardLayout;
}) {
  const href = locale === 'en' ? `/date-ideas/${article.slug}` : `/${locale}/date-ideas/${article.slug}`;
  const baseClassName =
    "group relative h-full rounded-[28px] overflow-hidden bg-white/90 ring-1 ring-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl";
  const isPatterned = Boolean(layout);
  const layoutStyle = layout?.area
    ? ({ "--grid-area": layout.area } as React.CSSProperties)
    : undefined;

  if (layout?.variant === "overlay") {
    return (
      <Link href={href} className={`${baseClassName} date-ideas-card`} style={layoutStyle}>
        <div className="absolute inset-0">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={CARD_IMAGE_SIZES}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/25 to-transparent" />
        <div className="relative h-full p-6 md:p-8 flex flex-col justify-end gap-4 text-white">
          <h3 className="text-2xl md:text-3xl font-semibold leading-tight drop-shadow-sm">
            {article.title}
          </h3>
          <CategoryPill label={article.category} variant="dark" />
        </div>
      </Link>
    );
  }

  if (layout?.variant === "split") {
    return (
      <Link href={href} className={`${baseClassName} date-ideas-card flex flex-col lg:flex-row`} style={layoutStyle}>
        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:w-1/2 lg:h-full lg:min-h-full overflow-hidden">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={CARD_IMAGE_SIZES}
          />
        </div>
        <div className="flex flex-col p-5 md:p-6 lg:w-1/2">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">
            {article.title}
          </h3>
          <div className="mt-auto flex items-center">
            <CategoryPill label={article.category} />
          </div>
        </div>
      </Link>
    );
  }

  const stackedMediaClassName = isPatterned
    ? "relative w-full aspect-4/3 md:aspect-auto md:flex-[3_1_0%] md:min-h-0 overflow-hidden"
    : "relative w-full aspect-4/3 overflow-hidden";
  const stackedContentClassName = isPatterned
    ? "p-6 flex flex-col grow md:flex-[2_1_0%] md:min-h-0"
    : "p-6 flex flex-col grow";

  return (
    <Link
      href={href}
      className={`${baseClassName} ${isPatterned ? "date-ideas-card" : ""} flex flex-col`}
      style={layoutStyle}
    >
      <div className={stackedMediaClassName}>
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={CARD_IMAGE_SIZES}
        />
      </div>
      <div className={stackedContentClassName}>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">
          {article.title}
        </h3>
        <div className="mt-auto flex items-center">
          <CategoryPill label={article.category} />
        </div>
      </div>
    </Link>
  );
}

function CategoryPill({ label, variant = "light" }: { label: string; variant?: "light" | "dark" }) {
  const baseClassName =
    "inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]";
  const variantClassName =
    variant === "dark"
      ? "bg-white/15 text-white ring-1 ring-white/30"
      : "bg-white/90 text-gray-700 ring-1 ring-black/5 shadow-sm";

  return <span className={`${baseClassName} ${variantClassName}`}>{label}</span>;
}
