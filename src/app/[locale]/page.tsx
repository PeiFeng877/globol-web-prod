/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: params: { locale }
 * OUTPUT: Localized homepage
 * POS: App Router Page
 * CONTRACT: Renders landing page and localized SEO metadata.
 * 职责: 多语言首页与 SEO 元数据。
 */
import { MainCarousel } from "@/components/sections/MainCarousel";
import Link from 'next/link';
import { Metadata } from 'next';
import { locales } from '@/i18n/settings';
import { getDictionary } from '@/i18n/server';

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
  const ogImage = '/assets/slide-1.png';

  return {
    title: t.seo.homeTitle,
    description: t.seo.homeDescription,
    openGraph: {
      title: t.seo.homeTitle,
      description: t.seo.homeDescription,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.seo.homeTitle,
      description: t.seo.homeDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: locale === 'en' ? '/' : `/${locale}/`,
      languages: Object.fromEntries(
        locales.map(loc => [
          loc,
          loc === 'en' ? '/' : `/${loc}/`
        ])
      )
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const dateIdeasLink = locale === 'en' ? '/date-ideas' : `/${locale}/date-ideas`;

  return (
    <main className="min-h-screen bg-off-white">
      <h1 className="sr-only">Globol: Connect with Global Friends - Real-time Chat & Translation</h1>
      <MainCarousel locale={locale} />

      {/* SEO Content Section */}
      <section className="py-20 px-8 md:px-16 lg:px-24 container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            {t.homepage.title}
          </h2>
          <div className="mb-12">
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t.homepage.intro}
            </p>
            <div className="text-left max-w-2xl mx-auto space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.homepage.whyChooseTitle}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  <span className="text-gray-700"><strong>{t.homepage.languageLearningTitle}</strong> {t.homepage.languageLearning}</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  <span className="text-gray-700"><strong>{t.homepage.culturalExchangeTitle}</strong> {t.homepage.culturalExchange}</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                  <span className="text-gray-700"><strong>{t.homepage.effortlessConnectionTitle}</strong> {t.homepage.effortlessConnection}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.homepage.globalCommunityTitle}</h3>
              <p className="text-gray-600">{t.homepage.globalCommunityDesc}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.homepage.realTimeTranslationTitle}</h3>
              <p className="text-gray-600">{t.homepage.realTimeTranslationDesc}</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-gray-900">{t.homepage.authenticConnectionsTitle}</h3>
              <p className="text-gray-600">{t.homepage.authenticConnectionsDesc}</p>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">{t.homepage.exploreGuidesTitle}</h3>
            <p className="text-gray-600 mb-8">
              {t.homepage.exploreGuidesDesc}
            </p>
            <Link href={dateIdeasLink} className="inline-block px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors">
              {t.homepage.readDateIdeas}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
