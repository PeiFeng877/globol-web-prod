# src/AGENTS.md - 源代码架构 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md

## 1. 🗺 地图 (结构)
```
src/
├── AGENTS.md
├── app/          # Next.js App Router (页面, 布局, SEO)
├── components/   # UI 组件与业务展示组件
├── collections/  # Payload CMS 数据集合定义
├── content/      # Markdown 内容与本地化文章/法律文本
├── data/         # 结构化静态数据
├── i18n/         # 国际化逻辑与语言包
├── lib/          # 内容解析与通用工具
├── migrations/   # Payload CMS 数据库迁移脚本
└── middleware.ts # 路由语言前缀中间件
```

## 2. 🧩 模块 (Modules)
- `app/`: 路由入口与 SEO 元数据，负责页面拼装。
- `components/`: 可复用 UI、布局、业务展示组件与统计代码（analytics）。
- `collections/`: Payload CMS 核心数据模型与字段约束定义。
- `content/`: Markdown 内容仓库，文章与法律文本按语言分区。
- `data/`: 国际交友等静态数据源与类型定义。
- `i18n/`: 语言配置、字典与客户端/服务端加载器。
- `lib/`: 内容解析与跨模块工具函数（含 Firebase 客户端初始化）。
- `migrations/`: 基于 Payload Drizzle 的 Schema 迁移与变更记录。
- `middleware.ts`: 统一语言前缀与路由重写策略。

## 3. 🔗 依赖边界 (Dependencies)
- `app/` 可依赖 `components/`, `i18n/`, `lib/`, `data/`, `content/`。
- `components/` 不反向依赖 `app/`。
- `data/` 与 `lib/` 保持纯函数与无副作用。
- `i18n/` 仅输出配置与字典，不读取业务组件。

## 4. 📐 规范 (Rules)
- 页面只做拼装与 SEO，数据处理下沉到 `lib/` 或 `data/`。
- 组件尽量无状态，必要状态上移到页面或 features 层。
- 语言文案集中在 `i18n` 字典，不在组件内硬编码。

## 5. 🧾 变更日志 (Changelog)
- 2026-02-21: 新增 `collections/` 与 `migrations/` 目录说明，反映 Payload CMS 基于实体与语言标签的多语言架构重构。
- 2026-02-08: 新增 International Dating AI 聊天能力（`app/api/ai-chat`、`lib/ai`、`components/features/dating/chat`）。
- 2026-02-03: 补齐 L2 协议头与模块边界描述。
- 2026-02-05: `content/` 扩展为文章与法律文本的多语言内容仓库。
- 2026-02-05: 新增 Firebase Analytics 客户端初始化能力。
