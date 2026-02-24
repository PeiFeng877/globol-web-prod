/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: params: { locale, slug, vibe }
 * OUTPUT: Localized PSEO Combinatorial Page
 * POS: App Router Page
 * CONTRACT: Renders large scale dynamically generated Date Locations based on slug & vibe intersections.
 * 职责: 基于城市与氛围的 pSEO 聚合页与 ISR 配置。
 */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPseoData } from '@/lib/content';
import { locales } from '@/i18n/settings';
import { MapPin, Info } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{
        locale: string;
        slug: string;
        vibe: string;
    }>;
}

// Ensure non-defined combinations fall back to on-demand generation (ISR)
export const dynamicParams = true;

// Pre-render the core experimental subset at build-time
export async function generateStaticParams() {
    const combinations = [];
    for (const locale of locales) {
        for (const vibe of ['romantic', 'fun', 'cozy', 'adventurous']) {
            combinations.push({ locale, slug: 'tokyo', vibe });
        }
    }
    return combinations;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug, vibe } = await params;
    const data = await getPseoData(locale, slug, vibe);

    if (!data) {
        return { title: 'Not Found' };
    }

    return {
        title: `${data.template.title} | Globol`,
        description: data.template.description,
        openGraph: {
            title: `${data.template.title} | Globol`,
            description: data.template.description,
            type: 'article',
        },
        alternates: {
            canonical: locale === 'en' ? `/date-ideas/${slug}/${vibe}` : `/${locale}/date-ideas/${slug}/${vibe}`,
            languages: Object.fromEntries([
                ['x-default', `/date-ideas/${slug}/${vibe}`],
                ...locales.map((loc: string) => [
                    loc,
                    loc === 'en' ? `/date-ideas/${slug}/${vibe}` : `/${loc}/date-ideas/${slug}/${vibe}`
                ])
            ])
        }
    };
}

export default async function PseoPage({ params }: PageProps) {
    const { locale, slug, vibe } = await params;
    const data = await getPseoData(locale, slug, vibe);

    if (!data) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-off-white pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-pink-50 to-blue-50 py-20 px-4 md:px-8 border-b border-gray-100 mb-12">
                <div className="max-w-3xl mx-auto text-center">
                    <Link href={locale === 'en' ? `/date-ideas` : `/${locale}/date-ideas`} className="text-pink-600 font-semibold hover:underline mb-4 inline-block">
                        &larr; Discover more Date Ideas
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        {data.template.title}
                    </h1>
                    <div className="prose prose-lg mx-auto text-gray-700" dangerouslySetInnerHTML={{ __html: data.template.heroHtml }} />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto px-4 md:px-8">
                {data.locations.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                        More date locations are currently being curated by our community...
                    </div>
                ) : (
                    <div className="space-y-8">
                        {data.locations.map((loc, idx: number) => (
                            <article key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow">
                                <div className="flex items-start mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{loc.title}</h2>
                                        <p className="flex items-center text-gray-500 mt-1 space-x-1">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm font-medium">{data.city.name}, {data.city.country}</span>
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-6 mt-4">
                                    {loc.description}
                                </p>

                                {loc.tips && (
                                    <div className="bg-amber-50 rounded-xl p-4 flex items-start text-amber-800 border border-amber-100">
                                        <Info className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-amber-600" />
                                        <span className="text-sm leading-relaxed">{loc.tips}</span>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
