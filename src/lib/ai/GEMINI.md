# src/lib/ai/GEMINI.md - AI 网关子模块 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

## 1. 🗺 地图 (结构)
```
ai/
├── GEMINI.md
├── chat-prompt.ts
├── gateway.ts
└── translation.ts
```

## 2. 📄 文件说明 (Files)
- `chat-prompt.ts`: 将角色资料与上下文组装为系统提示词和消息队列。
- `gateway.ts`: 调用 Vercel AI Gateway 并统一错误与超时处理。
- `translation.ts`: 封装阿里 Qwen-MT 翻译模型，支持场景化（如 `image-alt`）与 15 语种并发翻译提取。

## 3. 🔗 依赖边界 (Dependencies)
- 仅依赖运行时环境变量与标准 `fetch`。
- 不依赖 `app/` 或 `components/`。

## 4. 📐 规范 (Rules)
- Prompt 必须注入角色人设与安全约束。
- 网关请求必须设置超时并返回统一错误语义。

## 5. 🧾 变更日志 (Changelog)
- 2026-02-23: 新增 `translation.ts` 用于内部辅助多语言自动翻译工具（qwen-mt-flash）。
- 2026-02-08: 新增 AI Prompt 与 Gateway 调用封装。
