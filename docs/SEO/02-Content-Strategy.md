# 02 - 内容策略 (Content Strategy)

本文档规范了如何在 Globol 网站上发布内容以符合 SEO 标准。

## 1. 数据管理

目前全站内容通过单文件管理：`src/lib/articles.ts`。

### 1.1 数据结构
每篇文章必须包含以下字段：
- **title**: H1 标题，包含核心关键词。
- **slug**: URL 唯一标识符。
- **subtitle**: 用于 Meta Description，长度控制在 150-160 字符以内。
- **image**: 高质量的封面图，推荐使用 WebP 或 AVIF 格式。
- **publishedAt**: 发布日期，用于 Sitemap 的 `lastModified`。

## 2. Title & Description (T&D) 规则

| 页面类型 | Title 模板 | Description 来源 |
| :--- | :--- | :--- |
| **首页** | Globol - Connect Global Friends | 品牌核心价值主张（连接、语言、分享）。 |
| **列表页** | Date Ideas - Globol | 描述板块内容，如“全球约会指南、关系建议”。 |
| **文章页** | [文章标题] - Globol | 文章的 `subtitle` 字段。 |

## 3. 首页内容增强

为解决单页应用常见的“内容贫瘠 (Thin Content)”问题，我们在首页底部强制增加了 SEO 文本区：
- **H2 标题**: 包含次级关键词（如 Connect, International Friendships）。
- **正文**: 至少 300 字的描述性文本，帮助 Google 理解网站主题。
