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
│   ├── SEO_WORK_LOG.md
│   ├── seo-audit-acceptance.md
│   └── README.md
├── Core-System-Architecture.md
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
- `Core-System-Architecture.md`: 核心系统架构与工作流宪法，详述底层数据库选型 (Supabase vs Vercel)、渲染缓存机制 (ISR)、Vercel 部署脱钩安全策略及多语言一键发布 SOP。
- `i18n-standard.md`: 国际化标准与实施指南。
- `analytics-monitoring.md`: Firebase/GA4 监控方案与指标定义。

## 3. 📐 规范 (Rules)
- 文档只描述流程与模板，不嵌入业务逻辑实现细节。
- 任何新增模板或目录层级必须同步更新本文件与子模块 L2。

## 4. 🧾 变更日志 (Changelog)
- 2026-02-22: 回收并清理历史过期的多份架构探讨文档，熔炼精简出唯一的 `Core-System-Architecture.md` 统领数据流转宪法。
- 2026-02-21: 新增 `Content-Workflow.md` 详述基于扁平化实体与语言标签的内容发布与同步机制。
- 2026-02-20: 新增 `06-Architecture-Evolution-2026.md` 架构演进与内容扩展方案探讨文档。
- 2026-02-19: 同步 SEO 文档集、审计日志与国际化标准文档。
- 2026-02-03: 建立 docs 文档模块地图与协议头。
- 2026-02-05: 新增 SEO 审计与验收记录文档。
- 2026-02-06: 新增 Firebase Analytics 监控方案文档。
