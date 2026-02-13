# Globol SEO 工作记录与策略

> **文档目标**: 记录 Globol 项目的 SEO 实施情况、当前策略及未来优化方向。
> **更新频率**: 每次进行重大 SEO 调整后。

## 1. 当前 SEO 策略 (Current Strategy)
我们的核心策略是**复刻竞品 (Boo, Tandem)** 的成功模式，通过高质量的内容页（如 Date Ideas, Friends）截获搜索流量，并引导至 App 下载。

### 1.1 技术 SEO (Technical SEO)
目前已实施的架构层面的优化：
- **Next.js SSR/SSG**: 利用 Next.js 的服务端渲染能力，确保爬虫能获取完整 HTML。
- **动态 Metadata**: 每个页面根据内容动态生成 `title`, `description`, `canonical` 和 `alternates` (多语言关联)。
- **多语言路由**: 采用 `/en/`, `/zh/` 路径结构，并在 `<head>` 中正确声明 `hreflang`，防止重复内容惩罚。
- **语义化标签**: 强制使用 `<main>`, `<article>`, `<section>`, `<h1>`-`<h3>` 等语义化 HTML 标签。

### 1.2 内容策略 (Content Strategy)
- **长尾关键词覆盖**: 通过 `date-ideas` 等话题覆盖具体的搜索意图。
- **结构化数据 (Schema.org)**: (计划中/部分实施) 为文章页添加 Article Schema，为问答页添加 FAQ Schema。
- **静态资源优化**: 图片使用 WebP/AVIF 格式，并存放在 `public/` 目录下，配合 CDN 加速。

## 2. 已完成工作 (Completed Work)
*截至 2026年2月*

- [x] **基础架构搭建**: 完成 Next.js + Tailwind + i18n 的基础脚手架。
- [x] **国际化路由**: 实现 `middleware.ts` 自动处理语言跳转 (`/` -> `/en/`)。
- [x] **Markdown 内容系统**: 建立 `src/content` 文件系统，支持 Frontmatter 元数据解析。
- [x] **元数据系统**: 在 `layout.tsx` 和 `page.tsx` 中实现了动态 Metadata 生成逻辑。
- [x] **文档体系**: 建立了 `docs/SEO` 文件夹，梳理了技术、内容、结构化数据等规范。

## 3. 进行中的工作 (Ongoing Work)
- [ ] **Sitemap 自动化**: 完善 `next-sitemap` 配置，确保新文章自动提交给 Google。
- [ ] **结构化数据增强**: 在 `date-ideas` 页面实装 Schema.org JSON-LD。
- [ ] **性能监控**: 接入 Vercel Analytics 或 Google Search Console 数据监控。

## 4. 数据监控指标 (KPIs)
- **收录量 (Indexed Pages)**: GSC 中的有效页面数。
- **点击率 (CTR)**: 搜索结果的点击比率。
- **核心网页指标 (CWV)**: LCP, FID, CLS 分数（目标全绿）。
