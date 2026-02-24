/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: Content from lib/content, data/profiles, i18n/settings
 * OUTPUT: public/sitemap.xml (static file, no trailing slashes)
 * POS: Build Script
 * CONTRACT: Pre-generates sitemap.xml into public/ before Next.js build.
 * 职责: 绕过 Next.js MetadataRoute 的尾部斜杠自动追加行为，手动生成 sitemap。
 *
 * Usage: node --import tsx scripts/generate-sitemap.ts
 * Called by: npm run build (via prebuild script)
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { getAllArticles } from '../src/lib/content';
import { locales } from '../src/i18n/settings';
import { BASE_URL } from '../src/lib/constants';
import { profiles, getCountries } from '../src/data/profiles';

// ─── Helpers ─────────────────────────────────────────────────────
const locUrl = (locale: string, path: string) =>
    locale === 'en' ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;

const xhref = (path: string) =>
    locales
        .map(loc => `    <xhtml:link rel="alternate" hreflang="${loc}" href="${locUrl(loc, path)}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${path}"/>`)
        .join('\n');

const urlEntry = (url: string, path: string, freq: string, pri: number, mod?: string) =>
    `  <url>
    <loc>${url}</loc>
    <lastmod>${mod ?? new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
${xhref(path)}
  </url>`;

// ─── Generate ────────────────────────────────────────────────────
async function generate(): Promise<string> {
    const articles = await getAllArticles('en');
    const entries: string[] = [];

    // 1. Homepage
    for (const locale of locales) {
        const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`;
        entries.push(urlEntry(url, locale === 'en' ? '' : `/${locale}`, 'daily', 1.0));
    }

    // 2. Date Ideas list
    for (const locale of locales) {
        entries.push(urlEntry(locUrl(locale, '/date-ideas'), '/date-ideas', 'weekly', 0.8));
    }

    // 3. Article detail
    for (const article of articles) {
        const path = `/date-ideas/${article.slug}`;
        for (const locale of locales) {
            entries.push(urlEntry(locUrl(locale, path), path, 'monthly', 0.8, article.publishedAt));
        }
    }

    // 4. Static pages
    for (const page of ['about', 'contact']) {
        const path = `/${page}`;
        for (const locale of locales) {
            entries.push(urlEntry(locUrl(locale, path), path, 'monthly', 0.6));
        }
    }

    // 5. International Dating — main + filters
    const genders = ['man', 'woman'];
    const countries = getCountries();
    const datingPaths: { path: string; pri: number }[] = [
        { path: '/international-dating', pri: 0.9 },
    ];
    for (const gender of genders) {
        datingPaths.push({ path: `/international-dating/${gender}`, pri: 0.8 });
        for (const country of countries) {
            datingPaths.push({ path: `/international-dating/${gender}/${country}`, pri: 0.8 });
        }
    }
    for (const { path, pri } of datingPaths) {
        for (const locale of locales) {
            entries.push(urlEntry(locUrl(locale, path), path, 'daily', pri));
        }
    }

    // 6. Profile pages
    for (const profile of profiles) {
        const slug = profile.name.toLowerCase().replace(/\s+/g, '-');
        const path = `/international-dating/profile/${slug}`;
        for (const locale of locales) {
            entries.push(urlEntry(locUrl(locale, path), path, 'weekly', 0.7));
        }
    }

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ...entries,
        '</urlset>',
    ].join('\n');
}

// ─── Write ───────────────────────────────────────────────────────
const output = join(process.cwd(), 'public', 'sitemap.xml');
async function run() {
    writeFileSync(output, await generate(), 'utf-8');
    console.log(`✅ sitemap.xml generated → ${output}`);
}
run();
