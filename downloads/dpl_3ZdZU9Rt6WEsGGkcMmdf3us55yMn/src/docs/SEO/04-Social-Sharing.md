# 04 - 社交分享 (Social Sharing)

本文档介绍了社交媒体分享功能的实现细节。

## 1. Open Graph 协议
为了确保链接在 Facebook, WhatsApp, iMessage 等平台分享时显示精美卡片，我们配置了以下 OG 标签：

- **og:title**: 与页面 Title 一致。
- **og:description**: 与页面 Description 一致。
- **og:image**: 动态调用文章的封面图。
- **og:type**: 文章页为 `article`（目前统一使用 `website`，后续可优化）。

## 2. 分享按钮组件
位于文章底部的分享栏 (`ShareButtons.tsx`) 是完全客户端交互的。

### 2.1 支持平台
- **Facebook**: 使用 `sharer.php` 接口。
- **Twitter (X)**: 使用 `intent/tweet` 接口，预填充标题和链接。
- **LinkedIn**: 使用 `share-offsite` 接口。
- **Copy Link**: 通用分享。优先尝试调用原生 Web Share API (`navigator.share`)，如果不支持（如在桌面端），则回退到剪贴板复制。

### 2.2 实现细节
由于组件是 Client Component (`'use client'`)，它会在浏览器端动态获取 `window.location.origin` 来构建完整的分享链接，确保在任何环境（本地、测试、生产）下链接都是正确的。
