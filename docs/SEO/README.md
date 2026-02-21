# Globol SEO 文档

本目录包含了 Globol 项目的所有 SEO 相关文档、规则和技术规范。

## 文档索引

1.  **[01 - 技术架构 (Technical Architecture)](./01-Technical-Architecture.md)**
    *   元数据 (Metadata) 配置
    *   URL 结构与规范标签 (Canonical)
    *   静态生成 (SSG) 策略
    *   Sitemap 与 Robots.txt

2.  **[02 - 内容策略 (Content Strategy)](./02-Content-Strategy.md)**
    *   数据结构规范
    *   Title & Description 撰写模板
    *   首页 SEO 内容增强

3.  **[03 - 结构化数据 (Structured Data)](./03-Structured-Data.md)**
    *   FAQPage Schema 实现详解
    *   Google 可见性规则 (Hidden Content Policy)

4.  **[04 - 社交分享 (Social Sharing)](./04-Social-Sharing.md)**
    *   Open Graph 协议配置
    *   前端分享按钮实现逻辑
    
5.  **[05 - 内容管理 (Content Management)](./05-Content-Management.md)**
    *   Markdown 内容结构
    *   多语言内容管理
    *   图片存储规范

6.  **[06 - 2026 架构演进方案探讨](./06-Architecture-Evolution-2026.md)**
    *   pSEO 与内容扩展策略
    *   CMS、对象存储选型与方案规划
    *   下一步基础设施升级的行动路线

## 快速维护指南

### 修改 Meta 信息
前往 `src/app/layout.tsx` 修改全站默认信息，或在 Markdown 文件的 Frontmatter 中修改单篇文章信息。

### 添加新文章
在 `src/content/articles/en/` 中创建新的 Markdown 文件。详见 [内容管理文档](./05-Content-Management.md)。

### 检查 SEO 分数
推荐使用 Chrome 开发者工具中的 Lighthouse 或 PageSpeed Insights 进行评分。
