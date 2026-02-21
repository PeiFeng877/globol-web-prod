/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Payload CMS REST API (Lexical JSON)
 * OUTPUT: ArticleData + markdown helpers
 * POS: Content Layer
 * CONTRACT: Fetches data via API, extracts localization, converts Lexical AST to HTML.
 * 职责: 文章与法律文本的内容解析与数据封装（现已迁移至 CMS 数据库驱动）。
 */
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { Config, LegalText, Destination, PseoTemplate, DateLocation } from '@/payload-types';

export interface FAQ {
  question: string;
  answer: string;
}

export interface ArticleData {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  heroImage?: string;
  publishedAt: string;
  faqs?: FAQ[];
  contentHtml: string;
}

// -------------------------------------------------------------
// Helper: 极其轻量级的 Lexical to HTML 转换器 (MVP 支持基础排版)
// -------------------------------------------------------------
function escapeHTML(str: string) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

function convertLexicalToHtml(node: Record<string, unknown> | null | undefined): string {
  if (!node) return '';

  if (node.type === 'text') {
    let text = escapeHTML((node.text as string) || '');
    const format = (node.format as number) || 0;
    if (format & 1) text = `<strong>${text}</strong>`;
    if (format & 2) text = `<em>${text}</em>`;
    if (format & 4) text = `<s>${text}</s>`;
    if (format & 8) text = `<u>${text}</u>`;
    if (format & 16) text = `<code>${text}</code>`;
    return text;
  }

  const childrenHtml = ((node.children as Record<string, unknown>[]) || []).map(convertLexicalToHtml).join('');

  switch (node.type) {
    case 'root':
      return childrenHtml;
    case 'paragraph':
      return `<p>${childrenHtml}</p>`;
    case 'heading':
      const tag = `h${(node.tag as string)?.replace('h', '') || 2}`; // e.g. "h2" from "h2"
      return `<${tag}>${childrenHtml}</${tag}>`;
    case 'list':
      const listTag = node.listType === 'number' ? 'ol' : 'ul';
      return `<${listTag}>${childrenHtml}</${listTag}>`;
    case 'listitem':
      return `<li>${childrenHtml}</li>`;
    case 'quote':
      return `<blockquote>${childrenHtml}</blockquote>`;
    case 'link':
      const fields = node.fields as { newTab?: boolean; url?: string } | undefined;
      const rel = fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHTML(fields?.url || '')}"${rel}>${childrenHtml}</a>`;
    default:
      return childrenHtml;
  }
}

// -------------------------------------------------------------
// CMS API Fetchers
// -------------------------------------------------------------

export async function getArticleBySlug(locale: string, slug: string): Promise<ArticleData> {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { slug: { equals: slug } },
        { language: { equals: locale } }
      ]
    },
  });

  if (!data.docs || data.docs.length === 0) {
    throw new Error(`Article not found in CMS: ${slug}`);
  }

  const article = data.docs[0];
  const contentHtml = convertLexicalToHtml(article.content?.root as Record<string, unknown>);

  const heroImageUrl = typeof article.heroImage === 'object' && article.heroImage?.url
    ? article.heroImage.url
    : '/assets/undraw_love_re_mwbq.svg';

  const articleObj = article as unknown as Record<string, unknown>;

  return {
    slug: article.slug as string,
    title: article.title as string,
    subtitle: article.description as string || '',
    category: (articleObj.category as string) || 'Relationships',
    heroImage: heroImageUrl,
    publishedAt: article.publishedAt || new Date().toISOString(),
    faqs: (articleObj.faqs as FAQ[]) || [],
    contentHtml,
  };
}

export async function getLegalContent(locale: string, slug: 'privacy' | 'terms'): Promise<string> {
  const payload = await getPayload({ config: configPromise });
  let data = await payload.find({
    collection: 'legal-texts',
    where: {
      and: [
        { slug: { equals: slug } },
        { language: { equals: locale } }
      ]
    },
  });

  // Fallback to English if translation is missing
  if (!data.docs || data.docs.length === 0) {
    data = await payload.find({
      collection: 'legal-texts',
      where: {
        and: [
          { slug: { equals: slug } },
          { language: { equals: 'en' } }
        ]
      },
    });
  }

  if (!data.docs || data.docs.length === 0) {
    throw new Error(`Legal content not found in CMS for slug: ${slug} (tested ${locale} and en fallbacks)`);
  }

  const legalDoc = data.docs[0] as unknown as LegalText;
  return convertLexicalToHtml(legalDoc.content?.root as Record<string, unknown>);
}

export async function getAllSlugs(): Promise<string[]> {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({
    collection: 'articles',
    limit: 1000,
    depth: 0,
    where: { language: { equals: 'en' } }, // Use 'en' as baseline for static slugs
  });
  return (data.docs || []).map(doc => doc.slug!);
}

export async function getAllArticles(locale: string = 'en'): Promise<Omit<ArticleData, 'contentHtml'>[]> {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({
    collection: 'articles',
    where: { language: { equals: locale } },
    limit: 100,
    sort: '-publishedAt',
  });

  return (data.docs || []).map(article => {
    const heroImageUrl = typeof article.heroImage === 'object' && article.heroImage?.url
      ? article.heroImage.url
      : '/assets/undraw_love_re_mwbq.svg';

    const articleObj = article as unknown as Record<string, unknown>;

    return {
      slug: article.slug as string,
      title: article.title as string,
      subtitle: article.description as string || '',
      category: (articleObj.category as string) || 'Relationships',
      heroImage: heroImageUrl,
      publishedAt: article.publishedAt || new Date().toISOString(),
      faqs: (articleObj.faqs as FAQ[]) || [],
    };
  });
}

export async function getAdjacentArticles(locale: string, currentSlug: string) {
  const articles = await getAllArticles(locale);
  const index = articles.findIndex(a => a.slug === currentSlug);

  if (index === -1) return { prev: null, next: null };

  const nextArticle = index > 0 ? articles[index - 1] : null;
  const prevArticle = index < articles.length - 1 ? articles[index + 1] : null;

  return { prev: prevArticle, next: nextArticle };
}

export async function getRelatedArticles(locale: string, currentArticle: ArticleData, limit: number = 4): Promise<Omit<ArticleData, 'contentHtml'>[]> {
  const allArticles = await getAllArticles(locale);

  // As a fallback since we dropped category schemas, just grab the latest docs directly as related items.
  const related = allArticles.filter(a => a.slug !== currentArticle.slug);
  return related.slice(0, limit);
}

// -------------------------------------------------------------
// PSEO API Fetchers
// -------------------------------------------------------------

export interface PseoLocationData {
  title: string;
  description: string;
  tips: string;
}

export interface PseoPageData {
  city: {
    name: string;
    slug: string;
    country: string;
    description: string;
  };
  template: {
    vibe: string;
    title: string;
    description: string;
    heroHtml: string;
  };
  locations: PseoLocationData[];
}

export async function getPseoData(locale: string, citySlug: string, vibe: string): Promise<PseoPageData | null> {
  const payload = await getPayload({ config: configPromise });

  // 1. Get Destination
  const destRes = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: citySlug } },
  });

  if (!destRes.docs || destRes.docs.length === 0) return null;
  const destination = destRes.docs[0] as unknown as Destination;

  // 2. Get Template
  const templateRes = await payload.find({
    collection: 'pseo-templates',
    where: { vibe: { equals: vibe } },
  });

  if (!templateRes.docs || templateRes.docs.length === 0) return null;
  const template = templateRes.docs[0] as unknown as PseoTemplate;

  // 3. Get Locations
  const locRes = await payload.find({
    collection: 'date-locations',
    where: {
      and: [
        { destination: { equals: destination.id } },
        { vibe: { equals: vibe } },
        { language: { equals: locale } }
      ]
    },
    sort: 'title',
  });

  const locations = (locRes.docs || []).map(doc => {
    const loc = doc as unknown as DateLocation;
    return {
      title: loc.title,
      description: loc.description,
      tips: loc.tips || '',
    };
  });

  // Resolve Template Variables
  const resolveTemplate = (tmpl: string) => {
    return tmpl.replace(/{{city_name}}/g, destination.name)
      .replace(/{{vibe_name}}/g, vibe);
  };

  const resolvedHeroHtml = resolveTemplate(convertLexicalToHtml(template.heroContent?.root));

  return {
    city: {
      name: destination.name,
      slug: destination.slug,
      country: destination.country,
      description: destination.description || '',
    },
    template: {
      vibe: template.vibe,
      title: resolveTemplate(template.titleTemplate),
      description: resolveTemplate(template.descriptionTemplate),
      heroHtml: resolvedHeroHtml,
    },
    locations,
  };
}

