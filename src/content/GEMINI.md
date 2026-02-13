# src/content/GEMINI.md - 内容仓库 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

## 1. 🗺 地图 (结构)
```
content/
├── articles/
│   ├── en/
│   └── zh/
└── legal/
    ├── en/
    │   ├── privacy.md
    │   └── terms.md
    └── zh/
        ├── privacy.md
        └── terms.md
```

## 2. 📄 文件说明 (Files)
- `articles/en/at-home-date-night-ideas.md`: 英文文章，居家约会之夜点子。
- `articles/en/cheap-date-ideas.md`: 英文文章，省钱约会点子。
- `articles/en/conversation-starters-for-couples.md`: 英文文章，情侣聊天开场白。
- `articles/en/conversation-topics.md`: 英文文章，聊天话题清单。
- `articles/en/cute-date-ideas.md`: 英文文章，可爱约会点子。
- `articles/en/date-night-movies.md`: 英文文章，约会夜电影清单。
- `articles/en/dating-tips-for-men.md`: 英文文章，男性约会建议。
- `articles/en/first-date-ideas.md`: 英文文章，初次约会建议。
- `articles/en/fun-date-ideas.md`: 英文文章，有趣约会点子。
- `articles/en/questions-to-ask-on-a-first-date.md`: 英文文章，首次约会提问清单。
- `articles/en/romantic-date-ideas.md`: 英文文章，浪漫约会点子。
- `articles/en/romantic-dinner-ideas.md`: 英文文章，浪漫晚餐点子。
- `articles/zh/at-home-date-night-ideas.md`: 中文文章，居家约会之夜点子。
- `articles/zh/cheap-date-ideas.md`: 中文文章，省钱约会点子。
- `articles/zh/conversation-starters-for-couples.md`: 中文文章，情侣聊天开场白。
- `articles/zh/conversation-topics.md`: 中文文章，聊天话题清单。
- `articles/zh/cute-date-ideas.md`: 中文文章，可爱约会点子。
- `articles/zh/date-night-movies.md`: 中文文章，约会夜电影清单。
- `articles/zh/dating-tips-for-men.md`: 中文文章，男性约会建议。
- `articles/zh/first-date-ideas.md`: 中文文章，初次约会建议。
- `articles/zh/fun-date-ideas.md`: 中文文章，有趣约会点子。
- `articles/zh/questions-to-ask-on-a-first-date.md`: 中文文章，首次约会提问清单。
- `articles/zh/romantic-date-ideas.md`: 中文文章，浪漫约会点子。
- `articles/zh/romantic-dinner-ideas.md`: 中文文章，浪漫晚餐点子。
- `legal/en/privacy.md`: 英文隐私政策。
- `legal/en/terms.md`: 英文服务条款。
- `legal/zh/privacy.md`: 中文隐私政策。
- `legal/zh/terms.md`: 中文服务条款。

## 3. 🔗 依赖边界 (Dependencies)
- 内容只被 `src/lib/content.ts` 读取，页面不直接读取文件系统。

## 4. 📐 规范 (Rules)
- 新增文章必须同时提供 `en` 与 `zh` 版本。
- 文件名与 slug 保持一致且全小写。
- 法律文本必须与站点支持语言同步更新。

## 5. 🧾 变更日志 (Changelog)
- 2026-02-03: 移除示例文章，补齐新增英文文章的中文译文，并统一使用默认头图。
- 2026-02-03: 建立 content 模块 L2 文档与内容清单。
- 2026-02-05: 新增 legal 内容目录与隐私政策/服务条款文档。
