# 03 - 结构化数据 (Structured Data)

本文档介绍了如何利用 Schema.org 标记来增强搜索结果展示（Rich Snippets）。

## 1. 已实现的 Schema

### 1.1 WebSite & Organization (全局)
在 `src/app/layout.tsx` 中，我们为全站配置了：
- **WebSite**: 定义网站名称和内部搜索框（Sitelinks Search Box）。
- **Organization**: 定义品牌 Logo 和社交媒体关联。

### 1.2 Article (文章页)
在 `src/app/date-ideas/[slug]/page.tsx` 中，注入完整的文章元数据：
- **Headline**: 文章标题
- **Description**: 文章摘要
- **Image**: 缩略图 URL
- **DatePublished**: 发布日期
- **Author/Publisher**: 关联 Organization

### 1.3 ItemList (列表页)
在 `src/app/date-ideas/page.tsx` 中，使用 ItemList 标记文章列表，帮助 Google 理解这是一个集合页面。

### 1.4 FAQPage
我们参考了竞品（如 Boo）的策略，重点优化 FAQ 内容。

#### 为什么使用？
Google 会在搜索结果中直接抓取 FAQ 内容并展示在链接下方。这能：
1. **霸占首屏**: 增加物理像素占用面积。
2. **提高点击率**: 用户在搜索页就能看到高质量回答。

#### 实现方式
我们通过 JSON-LD (JavaScript Object Notation for Linked Data) 注入数据。

在 `src/lib/articles.ts` 中，为文章对象添加 `faqs` 数组：
```typescript
faqs: [
  {
    question: "What is the 3-month rule?",
    answer: "The 3-month rule suggests..."
  }
]
```

#### 可见性规则 (重要)
**Google 严禁“隐形数据”**。即 JSON-LD 中的内容必须在页面上对用户可见。
- **解决方案**: 我们在文章底部实现了**折叠面板 (Accordion)** UI。
- **效果**: 既保持了页面的整洁，又满足了 Google “内容必须对用户可见”的要求。

## 2. 待实现 Schema
- **BreadcrumbList**: 标记面包屑导航，让搜索结果显示层级路径（如 `Home > Date Ideas > London`）。
