# src/components/AGENTS.md - 组件体系 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md

## 1. 🗺 地图 (结构)
```
components/
├── analytics/
│   ├── FirebaseAnalytics.tsx
│   └── PageViewTracker.tsx
├── features/
│   ├── ArticleContent.tsx
│   ├── HeroSection.tsx
│   ├── RecommendationGrid.tsx
│   └── dating/
│       ├── chat/
│       │   ├── AGENTS.md
│       │   ├── ChatModal.tsx
│       │   ├── ProfileChatLauncher.tsx
│       │   ├── chat-storage.ts
│       │   ├── trait-extractor.ts
│       │   └── types.ts
│       ├── ProfileGrid.tsx
│       └── UserCard.tsx
├── layout/
│   ├── Container.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LanguageSwitcher.tsx
│   └── Navbar.tsx
├── sections/
│   └── MainCarousel.tsx
└── ui/
    ├── Badge.tsx
    ├── Button.tsx
    ├── DownloadButtons.tsx
    └── ShareButtons.tsx
```

## 2. 📄 文件说明 (Files)
- `features/ArticleContent.tsx`: 文章正文容器与版式。
- `features/HeroSection.tsx`: 首页大图 Hero 区块。
- `features/RecommendationGrid.tsx`: 推荐内容卡片网格。
- `features/dating/ProfileGrid.tsx`: 交友卡片列表与空态。
- `features/dating/UserCard.tsx`: 单个用户卡片展示。
- `features/dating/chat/ChatModal.tsx`: AI 聊天弹窗与消息交互。
- `features/dating/chat/ProfileChatLauncher.tsx`: Say Hi 按钮与聊天入口控制器。
- `features/dating/chat/chat-storage.ts`: 聊天本地存储与计数工具。
- `features/dating/chat/trait-extractor.ts`: 三条消息特征提取与下载引导文案。
- `features/dating/chat/types.ts`: 聊天模块类型定义。
- `analytics/FirebaseAnalytics.tsx`: 客户端 Firebase Analytics 启动器（无 UI）。
- `analytics/PageViewTracker.tsx`: SPA 路由 page_view 上报组件（无 UI）。
- `layout/Container.tsx`: 通用宽度容器。
- `layout/Footer.tsx`: 页脚导航与品牌信息。
- `layout/Header.tsx`: 顶部导航栏（样例）。
- `layout/LanguageSwitcher.tsx`: 语言切换下拉。
- `layout/Navbar.tsx`: 站点主导航与多语言入口。
- `sections/MainCarousel.tsx`: 首页主轮播与下载 CTA。
- `ui/Badge.tsx`: 标签徽章。
- `ui/Button.tsx`: 按钮基础组件。
- `ui/DownloadButtons.tsx`: 下载 CTA 按钮组。
- `ui/ShareButtons.tsx`: 文章分享按钮组。

## 3. 🔗 依赖边界 (Dependencies)
- `ui/` 不依赖 `features/` 或 `layout/`。
- `layout/` 可以依赖 `ui/` 与 `i18n/`，但不依赖 `app/`。
- `features/` 可依赖 `data/` 与 `ui/`，不直接读写路由。

## 4. 📐 规范 (Rules)
- 所有组件默认无副作用，客户端交互必须显式标注 `use client`。
- 视觉样式集中在组件内部，页面层只做组合。

## 5. 🧾 变更日志 (Changelog)
- 2026-02-08: 新增 `features/dating/chat` 子模块，实现 International Dating AI 聊天入口、弹窗、存储与风控。
- 2026-02-03: 建立 components 模块 L2 文档与依赖边界。
- 2026-02-03: ProfileGrid/UserCard 新增可选详情链接与 CTA 文案支持。
- 2026-02-05: 新增 analytics 组件用于 Firebase Analytics 初始化。
- 2026-02-06: 新增 page_view 跟踪组件。
