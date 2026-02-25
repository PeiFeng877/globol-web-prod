/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: params: { locale }
 * OUTPUT: Localized Date Idea Generator Page
 * POS: App Router Page
 * CONTRACT: Renders Link Magnet interactive component and SEO metadata.
 * 职责: 约会灵感生成器页面与 SEO。
 */
import { Metadata } from 'next';
import { locales } from '@/i18n/settings';
import { getDictionary } from '@/i18n/server';
import { DateIdeaGenerator } from '@/components/features/dating/generator/DateIdeaGenerator';

interface PageProps {
    params: Promise<{
        locale: string;
    }>;
}

export const revalidate = 172800;

export async function generateStaticParams() {
    return locales.map((locale: string) => ({
        locale: locale,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = getDictionary(locale);
    const enT = getDictionary('en');
    const genDict = t.generator || enT.generator;

    return {
        title: `${genDict.title} | Globol`,
        description: genDict.subtitle,
        openGraph: {
            title: `${genDict.title} | Globol`,
            description: genDict.subtitle,
            type: 'website',
        },
        alternates: {
            canonical: locale === 'en' ? '/date-idea-generator' : `/${locale}/date-idea-generator`,
            languages: Object.fromEntries([
                ['x-default', '/date-idea-generator'],
                ...locales.map((loc: string) => [
                    loc,
                    loc === 'en' ? '/date-idea-generator' : `/${loc}/date-idea-generator`
                ])
            ])
        },
    };
}

export default async function DateIdeaGeneratorPage({ params }: PageProps) {
    const { locale } = await params;
    const t = getDictionary(locale);
    const enT = getDictionary('en');
    const genDict = t.generator || enT.generator;

    return (
        <main className="min-h-screen bg-red-50 py-12">
            <DateIdeaGenerator dict={genDict} locale={locale as 'en' | 'zh'} />
        </main>
    );
}
