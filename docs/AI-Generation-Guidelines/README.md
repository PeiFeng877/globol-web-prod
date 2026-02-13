# Date Ideas 内容生成指南

本文档概述了利用 AI 为 Globol 网站生成 "Date Ideas"（约会灵感）类文章的具体规范。

## 1. 文件夹结构与文件命名

### 1.1 内容目录
所有 Markdown 文件必须放置在以下目录结构中：
```
src/content/articles/
├── en/                 # 英文原文（源语言）
│   └── [slug].md       # 例如：last-minute-date-ideas.md
├── zh/                 # 中文翻译
│   └── [slug].md
└── ...
```

### 1.2 图片目录
图片必须存储在 public assets 文件夹中：
```
public/assets/articles/
└── [slug]/             # 文件夹名称必须与文章 slug 完全一致
    ├── hero.avif       # 主封面图（必需）
    └── [other-img].avif # 其他配图（可选）
```

### 1.3 命名规范
- **文件**: 使用 **kebab-case**（小写单词，用短横线连接）。
- **Slug 匹配**: 文件名（不含 `.md`）、元数据中的 `slug` 字段以及图片文件夹名称必须完全一致。
  - 示例: `last-minute-date-ideas`

## 2. 文件内容格式 (Markdown)

文件应为带有 YAML Frontmatter 的标准 Markdown 文件。

### 2.1 Frontmatter (元数据)
每个文件必须以 `---` 包裹的 YAML 块开头。

| 字段 | 类型 | 必需 | 描述 | 示例 |
|-------|------|----------|-------------|---------|
| `title` | string | 是 | 文章的主标题 (H1)。英文请使用 Title Case。 | "7 Last-Minute Date Ideas" |
| `slug` | string | 是 | URL 友好的标识符。必须与文件名一致。 | "last-minute-date-ideas" |
| `category` | string | 是 | 具体分类。不要只写 "Date Ideas"。建议使用: "First Dates", "Seasonal", "Outdoor", "At Home", "Budget-Friendly" 等。 | "First Dates" |
| `subtitle` | string | 是 | 简短描述/钩子 (Meta Description)。 | "Fun and spontaneous plans..." |
| `heroImage` | string | 是 | 封面图路径。 | "/assets/articles/[slug]/hero.avif" |
| `publishedAt`| string | 是 | ISO 日期格式 (YYYY-MM-DD)。 | "2026-02-02" |
| `faqs` | array | 否 | 用于 Schema 标记的问答列表。 | 见模板。 |

**FAQ 结构:**
```yaml
faqs:
  - question: "问题文本？"
    answer: "回答文本。"
```

### 2.2 正文内容
- **标题**: 使用 `##` 表示主要章节（约会点子）。如有需要，使用 `###` 表示子章节。
- **引言**: 2-3 段，用于引入话题。
- **主要内容**: 约会点子列表或结构化建议。
- **语调**: 友好、乐于助人、浪漫但务实、充满热情。
- **排版**: 使用粗体强调重点，使用无序列表展示清单。避免大段枯燥文字。

## 3. 图片要求

### 3.1 格式
- **类型**: **AVIF** (首选) 或 WebP。
- **原因**: 优化性能和加载速度。

### 3.2 命名
- **主图**: 必须命名为 `hero.avif` (或 `hero.webp`)。
- **位置**: 必须放在以文章 slug 命名的文件夹内。
  - `public/assets/articles/last-minute-date-ideas/hero.avif`

### 3.3 风格指南
- **主体**: 情侣互动、浪漫场景或具有美感的活动照片。
- **风格**: 自然光，“Instagram 风格”但要真实（尽量避免过于生硬的图库照片）。
- **构图**: 留有足够的负空间，避免重要元素过于贴边（防止在不同设备裁剪时丢失）。

### 3.4 尺寸规格 (Dimensions)

#### A. 头图 (Hero Image)
这是文章顶部的封面图。
- **宽高比**: **16:9** (推荐) 或 3:2。
- **推荐分辨率**: **1200 x 675 px**。
- **最小宽度**: 1200 px。
- **文件大小**: 控制在 150KB 以内。

#### B. 正文插图 (Body Images)
文章内部的配图（如有）。
- **宽高比**: 灵活，推荐 3:2 (横向) 或 4:3。
- **推荐宽度**: **800 px - 1000 px**。
- **文件大小**: 控制在 100KB 以内。
- **注意**: 必须是响应式的，不要写死 HTML 里的 width/height 属性（Markdown 插入通常只写 `![]()`）。

## 4. 具体内容要求 ("Date Ideas")

### 4.1 目标受众
- 年轻人 (Gen Z / Millennials)。
- 寻找约会灵感的人群（初次约会、长期伴侣）。

### 4.2 内容目标
- **可执行性**: 用户读完后应该有一个具体的计划。
- **多样性**: 包含不同预算（免费 vs 付费）和氛围（轻松 vs 活跃）的选项。
- **SEO 优化**:
  - 在引言和结尾自然地包含核心关键词（来自标题）。
  - 在标题中使用语义相关的变体。

### 4.3 FAQs (结构化数据)
- 在元数据 (Frontmatter) 结尾包含 3-5 个相关的常见问题 (FAQ)。
- 这些数据将专门用于生成 SEO 丰富网页摘要 (Rich Snippets)。
- **不要** 在正文中重复这些内容，除非为了文章流畅度必须这么做。

## 5. 示例

请查看 `docs/AI-Generation-Guidelines/templates/article-template.md` 获取可直接复制粘贴的模板。