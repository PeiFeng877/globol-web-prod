# src/components/features/dating/chat/GEMINI.md - AI 聊天子模块 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

## 1. 🗺 地图 (结构)
```
chat/
├── GEMINI.md
├── ChatModal.tsx
├── ProfileChatLauncher.tsx
├── chat-storage.ts
├── trait-extractor.ts
└── types.ts
```

## 2. 📄 文件说明 (Files)
- `ChatModal.tsx`: 聊天弹窗 UI、消息渲染、发送与上限锁定。
- `ProfileChatLauncher.tsx`: Say Hi 入口按钮与弹窗开关。
- `chat-storage.ts`: 基于 localStorage 的会话持久化与计数工具。
- `trait-extractor.ts`: 三条消息的规则化特征提取与 CTA 文案生成。
- `types.ts`: 聊天消息、会话与特征摘要类型契约。

## 3. 🔗 依赖边界 (Dependencies)
- 可依赖 `ui/`、`i18n/` 与 `lib/`。
- 不依赖页面路由层 `app/`。

## 4. 📐 规范 (Rules)
- 无登录会话必须按 `profileId` 隔离存储。
- 网页端最多 3 条用户消息，超限后必须锁定输入并展示下载 CTA。

## 5. 🧾 变更日志 (Changelog)
- 2026-02-08: 新增 International Dating AI 聊天子模块（入口、弹窗、存储、风控与类型）。
