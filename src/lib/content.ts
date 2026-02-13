/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Markdown files on disk
 * OUTPUT: ArticleData + markdown helpers
 * POS: Content Layer
 * CONTRACT: Parses markdown, extracts frontmatter, and returns HTML.
 * 职责: 文章与法律文本的内容解析与数据封装。
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');
const legalDirectory = path.join(process.cwd(), 'src/content/legal');

export interface FAQ {
  question: string;
  answer: string;
}

export interface ArticleData {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  heroImage: string;
  publishedAt: string;
  faqs?: FAQ[];
  contentHtml: string;
}

export async function getArticleBySlug(locale: string, slug: string): Promise<ArticleData> {
  const fullPath = path.join(articlesDirectory, locale, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Article not found: ${fullPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    title: data.title,
    subtitle: data.subtitle,
    category: data.category,
    heroImage: data.heroImage,
    publishedAt: data.publishedAt,
    faqs: data.faqs,
  };
}

export async function getLegalContent(locale: string, slug: 'privacy' | 'terms'): Promise<string> {
  const fullPath = path.join(legalDirectory, locale, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Legal content not found: ${fullPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);

  return processedContent.toString();
}

export function getAllSlugs(): string[] {
  // Use 'en' as the source of truth for slugs
  const enDirectory = path.join(articlesDirectory, 'en');
  if (!fs.existsSync(enDirectory)) {
      return [];
  }
  
  const fileNames = fs.readdirSync(enDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}

export function getAllArticles(locale: string = 'en'): Omit<ArticleData, 'contentHtml'>[] {
    const localeDirectory = path.join(articlesDirectory, locale);
    if (!fs.existsSync(localeDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(localeDirectory);
    const allArticles = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(localeDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title,
                subtitle: data.subtitle,
                category: data.category,
                heroImage: data.heroImage,
                publishedAt: data.publishedAt,
                faqs: data.faqs,
            };
        });
        
    // Sort posts by date
    return allArticles.sort((a, b) => {
        if (a.publishedAt < b.publishedAt) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAdjacentArticles(locale: string, currentSlug: string) {
    const articles = getAllArticles(locale);
    const index = articles.findIndex(a => a.slug === currentSlug);
    
    if (index === -1) return { prev: null, next: null };
    
    // articles are sorted by date DESC (newest first)
    // index - 1 is newer (Next)
    // index + 1 is older (Previous)
    const nextArticle = index > 0 ? articles[index - 1] : null;
    const prevArticle = index < articles.length - 1 ? articles[index + 1] : null;
    
    return { prev: prevArticle, next: nextArticle };
}

export function getRelatedArticles(locale: string, currentArticle: ArticleData, limit: number = 4): Omit<ArticleData, 'contentHtml'>[] {
  const allArticles = getAllArticles(locale);
  
  // 1. Filter out the current article
  const otherArticles = allArticles.filter(a => a.slug !== currentArticle.slug);

  // 2. Find articles in the same category
  const sameCategory = otherArticles.filter(a => a.category === currentArticle.category);

  // 3. Find articles in other categories (fallback)
  const otherCategories = otherArticles.filter(a => a.category !== currentArticle.category);

  // 4. Combine: Same category first, then others
  // We want to prioritize same category, but if we don't have enough, we fill with others.
  let related = [...sameCategory];

  // If we have more than enough in same category, just slice them (or maybe shuffle/randomize in future, but keep simple for now)
  // Currently they are sorted by date DESC from getAllArticles
  
  // Fill the rest with other categories if needed
  if (related.length < limit) {
      related = [...related, ...otherCategories];
  }

  return related.slice(0, limit);
}
