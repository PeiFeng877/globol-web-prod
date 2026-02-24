# Globol 网站项目

> **SEO 优先，面向全球的 Globol 官方网站。**
> *"简单是终极的复杂。"*

## 1. 🎯 项目概览 (Project Overview)
这是 **Globol** 的官方着陆页和内容中心，一款专注于实时翻译和全球连接的社交应用。
核心工程目标是 **SEO 表现** 和 **转化（应用下载）**。

**当前状态 (2026年2月):**
- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS v4
- **内容**: Markdown 驱动 (Headless CMS 模式)
- **国际化**: 自定义轻量级实现 (基于路径: `/en/...`, `/zh/...`)

## 2. 🏛 架构哲学 (Architecture Philosophy)
我们遵循 **奥卡姆剃刀 (Occam's Razor)** 原则。如果一个功能或文件不能直接贡献用户价值或开发者清晰度，它就会被移除。

- **拒绝冗余**: 我们移除了空的占位文件夹（`tests`, `assets` 在 src 下）和混乱的 README。
- **单一真相源 (Single Source of Truth)**: 
    - **代码结构**: `src/AGENTS.md`
    - **全局协议**: `AGENTS.md`
- **静态优先**: 资源放在 `public/`，内容放在 `src/content/`。

## 3. 📂 目录结构 (Directory Structure)

```
.
├── AGENTS.md           # 项目宪法与协议 (L1)
├── README.md           # 你在这里 (人类入口)
├── docs/               # 深度文档 (SEO 策略)
├── public/             # 静态资源 (图片, 图标)
│   └── assets/         # App 图片
├── src/
│   ├── AGENTS.md       # 源代码架构 (L2)
│   ├── app/            # Next.js 应用路由与页面
│   ├── components/     # React 组件 (原子化设计风格)
│   ├── content/        # Markdown 内容 (我们的"数据库")
│   ├── i18n/           # 国际化逻辑
│   ├── lib/            # 工具库 (Markdown 解析)
│   └── middleware.ts   # 路由逻辑 (语言重定向)
└── next.config.ts      # 框架配置
```

## 4. 🛠 关键工作流 (Key Workflows)

### 添加文章
1. 在 `src/content/articles/[locale]/` 中创建一个 Markdown 文件。
2. 确保 Frontmatter 包含 `title`, `description`, `publishedAt`, `heroImage`。
3. 将图片放入 `public/assets/articles/[slug]/`。

### 国际化 (Localization)
- 语言定义在 `src/i18n/settings.ts`。
- 字典字符串在 `src/i18n/locales/*.json`。
- 路由由 `middleware.ts` 自动处理。

## 5. 🚀 部署 (Deployment)
- **平台**: Vercel (推荐)
- **构建**: `npm run build`
- **输出**: 兼容静态导出 (主要)，目前运行为 SSR/Edge 混合模式。