/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: params: { locale, slug }
 * OUTPUT: Article detail page
 * POS: App Router Page
 * CONTRACT: Renders markdown article, related posts, and JSON-LD.
 * 职责: 文章详情页与结构化数据输出。
 * CHANGE: 2026-02-05 隐藏登录/注册入口 CTA
 * CHANGE: 2026-02-05 统一 canonical 与分享 URL
 */
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { getArticleBySlug, getAllSlugs, getAdjacentArticles, getRelatedArticles, type FAQ } from '@/lib/content';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { getDictionary } from '@/i18n/server';
import { locales } from '@/i18n/settings';

interface PageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  try {
    const article = await getArticleBySlug(locale, slug);

    const canonicalPath = locale === 'en' ? `/date-ideas/${slug}` : `/${locale}/date-ideas/${slug}`;

    return {
      title: article.title,
      description: article.subtitle,
      openGraph: {
        title: article.title,
        description: article.subtitle,
        images: [article.heroImage],
      },
      alternates: {
        canonical: canonicalPath,
        languages: Object.fromEntries([
          ['x-default', `/date-ideas/${slug}`],
          ...locales.map(loc => [
            loc,
            loc === 'en' ? `/date-ideas/${slug}` : `/${loc}/date-ideas/${slug}`
          ])
        ])
      },
    };
  } catch {
    return {
      title: 'Article Not Found',
    };
  }
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  
  return locales.flatMap(locale => 
    slugs.map(slug => ({ locale, slug }))
  );
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const showAuthCta = false;
  
  let article;
  try {
    article = await getArticleBySlug(locale, slug);
  } catch {
    notFound();
  }

  const { prev, next } = getAdjacentArticles(locale, slug);
  const relatedPosts = getRelatedArticles(locale, article, 4);
  const canonicalPath = locale === 'en' ? `/date-ideas/${slug}` : `/${locale}/date-ideas/${slug}`;
  const canonicalUrl = `https://globol.im${canonicalPath}`;

  const homeLink = locale === 'en' ? '/' : `/${locale}`;
  const dateIdeasLink = locale === 'en' ? '/date-ideas' : `/${locale}/date-ideas`;

  // Generate JSON-LD (Article + optional FAQPage)
  const articleSchema = {
    '@type': 'Article',
    headline: article.title,
    description: article.subtitle,
    image: [`https://globol.im${article.heroImage}`],
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Globol',
      url: 'https://globol.im'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Globol',
      logo: {
        '@type': 'ImageObject',
        url: 'https://globol.im/assets/logo.webp'
      }
    },
    inLanguage: locale
  };

  const faqSchema = article.faqs && article.faqs.length > 0 ? {
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq: FAQ) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      articleSchema,
      ...(faqSchema ? [faqSchema] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t.common.home,
            item: `https://globol.im${homeLink}`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t.common.dateIdeas,
            item: `https://globol.im${dateIdeasLink}`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: canonicalUrl
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section Container */}
      <div className="relative w-full mb-24">
          {/* Background Hero Image */}
          <div className="w-full h-[500px] md:h-[600px] relative">
              <Image
              src={article.heroImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
              />
          </div>

          {/* Floating Title Card */}
          <div className="absolute -bottom-16 left-0 right-0 px-4">
              <div className="max-w-4xl mx-auto bg-[#FFFEF6] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                  {/* Breadcrumbs */}
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
                      <Link href={homeLink} className="hover:text-gray-900 transition-colors">
                          {t.common.home}
                      </Link>
                      <ChevronRight size={14} className="text-gray-400" />
                      <Link href={dateIdeasLink} className="hover:text-gray-900 transition-colors">
                        {t.common.dateIdeas}
                      </Link>
                      <ChevronRight size={14} className="text-gray-400" />
                      <span className="font-medium text-gray-900 line-clamp-1">
                          {article.title}
                      </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
                      {article.title}
                  </h1>
              </div>
          </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-24">
        <div className="px-8 md:px-12">
           {/* Subtitle/Intro */}
           <div className="mb-12">
             <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {article.subtitle}
            </p>
          </div>

          {/* Content Body - Markdown Rendered */}
          <div 
            className="prose prose-lg prose-gray max-w-none mb-16 prose-headings:font-serif prose-headings:font-bold prose-img:rounded-2xl prose-a:text-yellow-600 hover:prose-a:text-yellow-700"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* FAQ Section Display */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-8">{t.article.faq}</h2>
              <div className="space-y-4">
                {article.faqs.map((faq: FAQ, index: number) => (
                  <details key={index} className="group bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300">
                    <summary className="flex justify-between items-center p-6 cursor-pointer font-bold text-gray-900 text-lg list-none hover:bg-gray-100 transition-colors">
                        {faq.question}
                        <span className="transition-transform duration-300 group-open:rotate-180">
                            <ChevronRight className="w-5 h-5" />
                        </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Sign Up CTA */}
          {showAuthCta && (
            <div className="flex justify-start mb-16">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full transition-colors duration-300">
                  {t.common.signUp}
              </button>
            </div>
          )}

          {/* Share Section */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">{t.common.share}</h3>
            <ShareButtons title={article.title} url={canonicalUrl} />
          </div>

          {/* Previous / Next Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-8 mb-16">
            {prev ? (
              <Link 
                href={locale === 'en' ? `/date-ideas/${prev.slug}` : `/${locale}/date-ideas/${prev.slug}`}
                className="group flex flex-col items-start p-6 rounded-2xl border border-gray-100 hover:border-yellow-400 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 group-hover:text-yellow-600">
                  <ArrowLeft size={16} />
                  {t.article.prev}
                </div>
                <span className="font-serif font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                  {prev.title}
                </span>
              </Link>
            ) : <div />}

            {next ? (
              <Link 
                href={locale === 'en' ? `/date-ideas/${next.slug}` : `/${locale}/date-ideas/${next.slug}`}
                className="group flex flex-col items-end text-right p-6 rounded-2xl border border-gray-100 hover:border-yellow-400 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 group-hover:text-yellow-600">
                  {t.article.next}
                  <ArrowRight size={16} />
                </div>
                <span className="font-serif font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                  {next.title}
                </span>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* Full Width Related Posts Container */}
      <div className="w-full">
         {/* Related Posts Section */}
         <div className="bg-yellow-400 py-16 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <h3 className="text-3xl font-serif font-bold text-gray-900 mb-12">
                  {t.common.moreDateIdeas}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {relatedPosts.map((post) => (
                     <Link href={locale === 'en' ? `/date-ideas/${post.slug}` : `/${locale}/date-ideas/${post.slug}`} key={post.slug} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                        <div className="relative h-56 w-full overflow-hidden">
                           <Image
                             src={post.heroImage}
                             alt={post.title}
                             fill
                             className="object-cover group-hover:scale-105 transition-transform duration-500"
                             sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                           />
                        </div>
                        <div className="p-6 flex flex-col grow">
                          <h4 className="text-lg font-bold text-gray-900 leading-snug mb-4 group-hover:text-gray-700 transition-colors">
                              {post.title}
                          </h4>
                           <div className="mt-auto pt-2 text-sm font-semibold underline decoration-2 underline-offset-4">
                              {t.common.readMore}
                           </div>
                        </div>
                     </Link>
                   ))}
                </div>
            </div>
         </div>
      </div>
    </>
  );
}
