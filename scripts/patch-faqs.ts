import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const LOCALE_MAP: Record<string, string> = {
    en: 'en',
    zh: 'zh',
    de: 'de',
    es: 'es',
    fr: 'fr',
    hi: 'hi',
    id: 'id',
    it: 'it',
    ja: 'ja',
    ko: 'ko',
    nl: 'nl',
    pt: 'pt',
    ru: 'ru',
    th: 'th',
    vi: 'vi',
};

async function patchFAQs() {
    const payload = await getPayload({ config: configPromise });
    console.log('Starting FAQ patch from Markdown to Payload CMS...');

    const articlesDir = path.join(process.cwd(), 'src/content/articles');
    if (!fs.existsSync(articlesDir)) {
        console.error('Articles directory not found at', articlesDir);
        process.exit(1);
    }

    const locales = fs.readdirSync(articlesDir).filter(dir => !dir.startsWith('.'));
    let updateCount = 0;

    for (const locale of locales) {
        const localeDir = path.join(articlesDir, locale);
        if (!fs.statSync(localeDir).isDirectory()) continue;

        const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.md'));

        for (const file of files) {
            const filePath = path.join(localeDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);

            const slug = file.replace('.md', '');
            const language = LOCALE_MAP[locale] || 'en';

            const faqs = Array.isArray(data.faqs) ? data.faqs.map((f: any) => ({
                question: String(f.question || ''),
                answer: String(f.answer || ''),
            })) : [];

            const category = typeof data.category === 'string' ? data.category : 'Relationships';

            if (faqs.length === 0 && !data.category) {
                // If there's neither FAQ nor category explicitly in the matter, maybe just skip patching to be faster
                continue;
            }

            // Find existing doc
            const existing = await payload.find({
                collection: 'articles',
                where: {
                    and: [
                        { slug: { equals: slug } },
                        { language: { equals: language } }
                    ]
                }
            });

            if (existing.docs.length > 0) {
                const doc = existing.docs[0];
                await payload.update({
                    collection: 'articles',
                    id: doc.id,
                    data: {
                        faqs,
                        category,
                    },
                });
                console.log(`[UPDATED] ${slug} (${language}) - FAQs: ${faqs.length}`);
                updateCount++;
            } else {
                console.log(`[NOT FOUND IN CMS] ${slug} (${language}) - Skipping update`);
            }
        }
    }

    console.log(`\n✅ Patching complete! Updated ${updateCount} articles with FAQs & Category.`);
    process.exit(0);
}

patchFAQs().catch((err) => {
    console.error(err);
    process.exit(1);
});
