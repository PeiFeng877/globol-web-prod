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
import { marked } from 'marked';
import { LegalText, Destination, PseoTemplate, DateLocation } from '@/payload-types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

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
  heroImageAlt?: string;
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
    let text = (node.text as string) || '';

    // 如果文本中包含典型的 markdown 结构（如 ## 或者 **），通过 marked 进行解析以恢复被合并的排版
    if (text.includes('# ') || text.includes('## ') || text.includes('**') || text.includes('*')) {
      return marked.parse(text) as string;
    }

    text = escapeHTML(text);
    // 强制将 Payload CMS 中直接出现的 \n 转换为 <br /> 
    text = text.replace(/\n/g, '<br />');

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
    case 'linebreak':
      return `<br />`;
    case 'upload':
      const val = node.value as { url?: string; alt?: string } | undefined;
      if (val && val.url) {
        const url = val.url.startsWith('/') ? `${CMS_URL}${val.url}` : val.url;
        return `<img src="${escapeHTML(url)}" alt="${escapeHTML(val.alt || '')}" />`;
      }
      return '';
    default:
      return childrenHtml;
  }
}

// -------------------------------------------------------------
// CMS API Fetchers
// -------------------------------------------------------------

export async function getArticleBySlug(locale: string, slug: string): Promise<ArticleData> {
  const res = await fetch(`${CMS_URL}/api/articles?where[and][0][slug][equals]=${slug}&where[and][1][language][equals]=${locale}`, {
    next: { tags: [`article-${slug}-${locale}`] }
  });
  if (!res.ok) throw new Error(`CMS API Error: ${res.statusText}`);
  const data = await res.json();

  if (!data.docs || data.docs.length === 0) {
    throw new Error(`Article not found in CMS: ${slug}`);
  }

  const article = data.docs[0];
  const contentHtml = convertLexicalToHtml(article.content?.root as Record<string, unknown>);

  // DEBUG LOG
  console.log(`[DEBUG] HTML for ${slug}:`, contentHtml.substring(0, 500) + '...');

  let heroImageUrl = '/assets/article-hero.avif';
  if (typeof article.heroImage === 'object' && article.heroImage?.url) {
    heroImageUrl = (article.heroImage.url as string).startsWith('/')
      ? `${CMS_URL}${article.heroImage.url}`
      : (article.heroImage.url as string);
  }

  const heroImageAlt = typeof article.heroImage === 'object' && article.heroImage?.alt
    ? (article.heroImage.alt as string)
    : (article.title as string);

  const articleObj = article as unknown as Record<string, unknown>;

  return {
    slug: article.slug as string,
    title: article.title as string,
    subtitle: article.description as string || '',
    category: (articleObj.category as string) || 'Relationships',
    heroImage: heroImageUrl,
    heroImageAlt: heroImageAlt,
    publishedAt: article.publishedAt || new Date().toISOString(),
    faqs: (articleObj.faqs as FAQ[]) || [],
    contentHtml,
  };
}

export async function getLegalContent(locale: string, slug: 'privacy' | 'terms'): Promise<string> {
  let res = await fetch(`${CMS_URL}/api/legal-texts?where[and][0][slug][equals]=${slug}&where[and][1][language][equals]=${locale}`);
  let data = res.ok ? await res.json() : { docs: [] };

  // Fallback to English if translation is missing
  if (!data.docs || data.docs.length === 0) {
    res = await fetch(`${CMS_URL}/api/legal-texts?where[and][0][slug][equals]=${slug}&where[and][1][language][equals]=en`);
    data = res.ok ? await res.json() : { docs: [] };
  }

  if (!data.docs || data.docs.length === 0) {
    throw new Error(`Legal content not found in CMS for slug: ${slug} (tested ${locale} and en fallbacks)`);
  }

  const legalDoc = data.docs[0] as unknown as LegalText;
  return convertLexicalToHtml(legalDoc.content?.root as Record<string, unknown>);
}

export async function getAllSlugs(): Promise<string[]> {
  const res = await fetch(`${CMS_URL}/api/articles?limit=1000&depth=0&where[language][equals]=en`);
  if (!res.ok) throw new Error(`CMS API Error: ${res.statusText}`);
  const data = await res.json();
  return (data.docs || []).map((doc: { slug?: string | null }) => doc.slug!);
}

export async function getAllArticles(locale: string = 'en'): Promise<Omit<ArticleData, 'contentHtml'>[]> {
  const res = await fetch(`${CMS_URL}/api/articles?where[language][equals]=${locale}&limit=100&sort=-publishedAt`, {
    next: { tags: [`articles-${locale}`] }
  });
  if (!res.ok) throw new Error(`CMS API Error: ${res.statusText}`);
  const data = await res.json();

  return (data.docs || []).map((article: Record<string, unknown>) => {
    let heroImageUrl = '/assets/article-hero.avif';
    if (typeof article.heroImage === 'object' && article.heroImage?.url) {
      heroImageUrl = (article.heroImage.url as string).startsWith('/')
        ? `${CMS_URL}${article.heroImage.url}`
        : (article.heroImage.url as string);
    }

    const heroImageAlt = typeof article.heroImage === 'object' && article.heroImage?.alt
      ? (article.heroImage.alt as string)
      : (article.title as string);

    const articleObj = article as unknown as Record<string, unknown>;

    return {
      slug: article.slug as string,
      title: article.title as string,
      subtitle: article.description as string || '',
      category: (articleObj.category as string) || 'Relationships',
      heroImage: heroImageUrl,
      heroImageAlt: heroImageAlt,
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
  // 1. Get Destination
  let res = await fetch(`${CMS_URL}/api/destinations?where[slug][equals]=${citySlug}`, {
    next: { tags: [`destinations-${citySlug}`] }
  });
  const destRes = res.ok ? await res.json() : { docs: [] };
  if (!destRes.docs || destRes.docs.length === 0) return null;
  const destination = destRes.docs[0] as unknown as Destination;

  // 2. Get Template
  res = await fetch(`${CMS_URL}/api/pseo-templates?where[vibe][equals]=${vibe}`, {
    next: { tags: [`pseo-templates-${vibe}`] }
  });
  const templateRes = res.ok ? await res.json() : { docs: [] };
  if (!templateRes.docs || templateRes.docs.length === 0) return null;
  const template = templateRes.docs[0] as unknown as PseoTemplate;

  // 3. Get Locations
  res = await fetch(`${CMS_URL}/api/date-locations?where[and][0][destination][equals]=${destination.id}&where[and][1][vibe][equals]=${vibe}&where[and][2][language][equals]=${locale}&sort=title`);
  const locRes = res.ok ? await res.json() : { docs: [] };

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

