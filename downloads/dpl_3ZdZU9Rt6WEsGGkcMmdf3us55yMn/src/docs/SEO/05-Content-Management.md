# Content Management System

## Overview

We use a file-based content management system using Markdown files. This allows for:
- Static Site Generation (SSG) for optimal SEO.
- Easy content management via Git.
- Native support for multiple languages.
- Zero-cost hosting on Vercel.

## Directory Structure

```
src/
  content/
    articles/
      en/                    # English articles (Source of truth)
        last-minute-date-ideas.md
      zh/                    # Chinese translations
        last-minute-date-ideas.md
public/
  assets/
    articles/
      last-minute-date-ideas/  # Article-specific assets
        hero.avif            # Hero image (Shared across languages)
```

## Adding a New Article

1.  **Create Assets Folder**:
    Create a folder in `public/assets/articles/[slug]/`.
    Add your hero image named `hero.avif` (Recommended size: 1200x630px).

2.  **Create English Article**:
    Create a Markdown file in `src/content/articles/en/[slug].md`.
    
    **Frontmatter Template:**
    ```markdown
    ---
    title: "Article Title"
    slug: "article-slug"
    category: "Category"
    subtitle: "Description for SEO and subtitle"
    heroImage: "/assets/articles/article-slug/hero.avif"
    publishedAt: "2026-02-02"
    faqs:
      - question: "Q1"
        answer: "A1"
    ---
    
    Article content in Markdown...
    ```

3.  **Create Translations**:
    Copy the English file to `src/content/articles/zh/[slug].md` and translate the content.
    **Important:** Keep the `slug` and `heroImage` path identical to the English version.

## Image Guidelines

-   **Storage**: Images are stored in `public/assets/articles/[slug]/`.
-   **Sharing**: All language versions share the same image files to save space.
-   **Format**: Use AVIF for best performance, or WebP.
-   **Usage**: In Markdown, use absolute paths: `![Alt](/assets/articles/slug/image.avif)`.

## URL Structure

-   **English (Default)**: `https://globol.im/date-ideas/[slug]`
-   **Chinese**: `https://globol.im/zh/date-ideas/[slug]`
-   **Other Languages**: `https://globol.im/[locale]/date-ideas/[slug]`

## SEO Features

-   **SSG**: Pre-rendered HTML for instant loading.
-   **Hreflang**: Automatically generated tags linking language versions.
-   **Structured Data**: Article and FAQPage Schema.org JSON-LD.
-   **Metadata**: Title, description, and OpenGraph tags from Frontmatter.
