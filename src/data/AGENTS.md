# src/data/AGENTS.md - 数据层 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md

## 1. 🗺 地图 (结构)
```
data/
└── profiles.ts
```

## 2. 📄 文件说明 (Files)
- `profiles.ts`: 国际交友用户样例数据与类型定义。

## 3. 📐 规范 (Rules)
- 数据保持纯静态，无副作用与运行时依赖。
- 字段变更必须同步更新依赖组件与页面。

## 4. 🧾 变更日志 (Changelog)
- 2026-02-08: 按需求恢复 `user_0008_kr_seoul_jioon` 数据与素材；International Dating 当前为 9 位 AI 用户。
- 2026-02-08: International Dating 示例数据替换为 `06-AI 生图/users` 的 9 个用户；移除旧示例人物数据并清理旧头像资源，统一改为 `/public/avatars/generated/<user_id>/`。
- 2026-02-08: feed 数据契约移除 `likes/comments` 字段，与纯展示卡片渲染保持一致。
- 2026-02-08: 新增 `u9` (Mina) 示例人物，接入头像与两条动态；`ProfileFeedItem` 增加可选 `image` 字段供详情页显示真实图片。
- 2026-02-03: 建立 data 模块 L2 文档与文件清单。
- 2026-02-03: 扩展 profiles 数据为详情页提供模拟数据与视图转换函数。
