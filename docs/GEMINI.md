# docs/GEMINI.md - 文档模块 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

## 1. 🗺 地图 (结构)
```
docs/
├── GEMINI.md
├── SEO/
│   ├── 02-Content-Strategy.md
│   ├── 03-Structured-Data.md
│   ├── 04-Social-Sharing.md
│   ├── SEO_AUDIT.md
│   ├── SEO_ISSUE_LOG.md
│   ├── SEO_WORK_LOG.md
│   ├── seo-audit-acceptance.md
│   └── README.md
├── testing/
│   └── TESTING-STANDARD.md
├── Core-System-Architecture.md
├── Production-Deployment-Checklist.md
├── analytics-monitoring.md
├── i18n-standard.md
└── AI-Generation-Guidelines/
    ├── GEMINI.md
    ├── README.md
    └── templates/
        └── article-template.md
```

## 2. 🧩 模块 (Modules)
- `AI-Generation-Guidelines/`: AI 生成内容规范与模板集合。
- `SEO/`: SEO 执行策略文档集，包含内容策略、结构化数据、社群分享，以及所有审计日志 (`SEO_AUDIT.md`, `SEO_WORK_LOG.md`, `seo-audit-acceptance.md`)。
- `testing/`: 测试规范与流程文档，定义小变更/大发版的测试流程与通过标准。
- `SEO/SEO_ISSUE_LOG.md`: SEO 问题历史日志，记录所有发现与修复过的 SEO 问题、根因及预防机制，含可执行的上线前检查命令。
- `Core-System-Architecture.md`: 核心系统架构与工作流宪法，详述底层数据库选型 (Supabase vs Vercel)、渲染缓存机制 (ISR)、Vercel 部署脱钩安全策略及多语言一键发布 SOP。
- `Production-Deployment-Checklist.md`: 生产环境部署清单，专门记录 Vercel/Supabase 线上云资源的配置状态及正式服上线前必须补齐的环境变量操作规范。
- `i18n-standard.md`: 国际化标准与实施指南。
- `analytics-monitoring.md`: Firebase/GA4 监控方案与指标定义。

## 3. 📐 规范 (Rules)
- 文档只描述流程与模板，不嵌入业务逻辑实现细节。
- 任何新增模板或目录层级必须同步更新本文件与子模块 L2。

## 4. 🧾 变更日志 (Changelog)
- 2026-02-23: 新增 `SEO/SEO_ISSUE_LOG.md`，记录 4 大历史 SEO 问题（重复 URL、尾斜杠、html lang 硬编码、GSC 重定向）及预防机制。
- 2026-02-22: 新增 `testing/TESTING-STANDARD.md` 测试规范文档，定义四维度测试体系与开发测试流程。
- 2026-02-22: 新增 `Production-Deployment-Checklist.md` 生产部署清单，记录同机房零延迟的 Supabase 及 Vercel 线上资源状态。
- 2026-02-22: 回收并清理历史过期的多份架构探讨文档，熔炼精简出唯一的 `Core-System-Architecture.md` 统领数据流转宪法。
- 2026-02-21: 新增 `Content-Workflow.md` 详述基于扁平化实体与语言标签的内容发布与同步机制。
- 2026-02-20: 新增 `06-Architecture-Evolution-2026.md` 架构演进与内容扩展方案探讨文档。
- 2026-02-19: 同步 SEO 文档集、审计日志与国际化标准文档。
- 2026-02-03: 建立 docs 文档模块地图与协议头。
- 2026-02-05: 新增 SEO 审计与验收记录文档。
- 2026-02-06: 新增 Firebase Analytics 监控方案文档。
