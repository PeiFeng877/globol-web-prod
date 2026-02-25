# src/app/api/GEMINI.md - API 路由子模块 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

## 1. 🗺 地图 (结构)
```
api/
├── GEMINI.md
└── ai-chat/
    └── route.ts
```

## 2. 📄 文件说明 (Files)
- `ai-chat/route.ts`: International Dating 聊天 API，含参数校验、3 条限制与 AI Gateway 转发。

## 3. 🔗 依赖边界 (Dependencies)
- API 层可依赖 `data/` 与 `lib/`，不依赖 `components/`。

## 4. 📐 规范 (Rules)
- 所有入参必须校验并清洗文本。
- 无登录接口必须具备最低限度的风控策略。

## 5. 🧾 变更日志 (Changelog)
- 2026-02-08: 新增 `ai-chat` 路由用于 AI 聊天能力接入。
