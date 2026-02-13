# 01 - 技术架构 (Technical Architecture)

本文档详细介绍了 Globol 网站的底层 SEO 技术实现。

## 1. 元数据管理 (Metadata Management)

我们利用 Next.js 16 App Router 的 Metadata API 来实现全面的页面头部控制。

### 1.1 全局配置
在 `src/app/layout.tsx` 中定义了全站的通用元数据：
- **metadataBase**: 设置为 `https://globol.im`。这解决了所有相对路径图片（如 `/assets/og.jpg`）在社交分享时无法显示的问题。
- **Open Graph**: 设置默认的 `type: 'website'` 和全站通用的分享预览图。

### 1.2 动态元数据
在 `src/app/date-ideas/[slug]/page.tsx` 中，我们使用 `generateMetadata` 函数。
- **动态获取**: 根据 URL 中的 slug 读取文章数据。
- **Title**: 格式为 `文章标题 - Globol`。
- **Description**: 使用文章的 `subtitle`。
- **Canonical URL**: 动态生成规范链接，确保 `https://globol.im/date-ideas/foo?ref=twitter` 统一指向 `https://globol.im/date-ideas/foo`。

## 2. URL 结构

我们采用扁平化的 URL 结构以利于抓取：

- **首页**: `/`
- **列表页**: `/date-ideas`
- **详情页**: `/date-ideas/[slug]`

**规则**: 所有 Slug 必须是小写，单词之间用连字符 (`-`) 连接。严禁使用下划线或骆驼拼写法。

## 3. 静态渲染 (Static Generation)

为了追求极致的页面加载速度（Core Web Vitals），所有文章页均为**静态生成 (SSG)**。

- **generateStaticParams**: 构建时，Next.js 会调用此函数获取所有文章的 Slug，并预先生成 HTML 文件。
- **优势**: 用户访问时无需等待数据库查询，TTFB (Time to First Byte) 极低。

## 4. 搜索引擎发现

- **Sitemap**: `src/app/sitemap.ts` 自动生成 `/sitemap.xml`，包含所有静态路由和动态文章路由。
- **Robots**: `src/app/robots.ts` 指引爬虫，并允许全站索引。

## 5. 标题层级 (Heading Hierarchy)

为了确保搜索引擎准确理解页面结构，我们严格遵守以下标题规范：

- **H1**: 每个页面**仅允许存在一个 H1**。
    - **首页**: 使用包含核心关键词（如 "Connect with Global Friends"）的 H1。若视觉设计上不展示大标题，则使用 `sr-only` 对屏幕阅读器和爬虫可见。
    - **轮播图**: 轮播图内的视觉大标题一律使用 **H2**，防止多个 H1 分散权重。
    - **列表页/详情页**: 页面主标题使用 H1。
- **H2-H6**: 用于划分内容区块，保持语义化嵌套。
