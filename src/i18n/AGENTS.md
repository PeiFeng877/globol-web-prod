# src/i18n/AGENTS.md - 国际化模块 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md

## 1. 🗺 地图 (结构)
```
i18n/
├── AGENTS.md
├── client.ts
├── server.ts
├── settings.ts
└── locales/
    ├── en.json
    └── zh.json
```

## 2. 📄 文件说明 (Files)
- `settings.ts`: 支持语言与默认语言配置。
- `server.ts`: 服务端字典加载与回退。
- `client.ts`: 客户端语言推断与翻译 hooks。
- `locales/en.json`: 英文文案字典。
- `locales/zh.json`: 中文文案字典。

## 3. 🔗 依赖边界 (Dependencies)
- `i18n/` 不依赖 `app/` 或 `components/`。
- 语言字典只读，不允许在运行时修改。

## 4. 📐 规范 (Rules)
- 新增文案必须在 `en.json` 与 `zh.json` 同步。
- 路由前缀必须遵循 `settings.ts` 的 `locales`。

## 5. 🧾 变更日志 (Changelog)
- 2026-02-03: 建立 i18n 模块 L2 文档与文件清单。
