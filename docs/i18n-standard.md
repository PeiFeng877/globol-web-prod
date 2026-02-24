# docs/i18n-standard.md - 多语言体系规范 (L2)
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md

## 1. 🗺 体系架构 (Architecture)

Globol 网站采用 **Next.js App Router + 路径前缀 (Path Prefix)** 方案，结合中间件拦截与静态生成，实现全站多语言覆盖。

### 1.1 核心机制
- **路由策略**: `/{locale}/{path}` (例如 `/es/date-ideas`)。
- **默认语言**: `en` (英语)。访问 `/` 会渲染英文内容（不强制跳转 `/en`，视中间件策略而定）。
- **中间件**: `src/middleware.ts` 负责根据 URL 前缀或 `Accept-Language` 头进行路由重写或跳转。
- **静态生成**: 页面通过 `generateStaticParams` 预渲染所有支持的语言路径。

### 1.2 支持语种 (Supported Locales)
截至 2026-02-09，支持以下 15 种语言（按字母序）：

| Code | Language (Native) | Coverage |
|------|-------------------|----------|
| `de` | Deutsch | 德国、奥地利、瑞士 |
| `en` | English | 全球通用 |
| `es` | Español | 西班牙、拉美 (Mexico, Argentina, etc.) |
| `fr` | Français | 法国、非洲法语区 |
| `hi` | हिन्दी | 印度 (北印度) |
| `id` | Bahasa Indonesia | 印度尼西亚 |
| `it` | Italiano | 意大利 |
| `ja` | 日本語 | 日本 |
| `ko` | 한국어 | 韩国 |
| `nl` | Nederlands | 荷兰、比利时 |
| `pt` | Português | 巴西、葡萄牙 |
| `ru` | Русский | 俄罗斯、独联体 |
| `th` | ภาษาไทย | 泰国 |
| `vi` | Tiếng Việt | 越南 |
| `zh` | 中文 | 中国大陆、新加坡、华人社区 |

## 2. 📂 文件结构与命名 (File Structure)

### 2.1 界面文案 (UI Strings)
存放位置：`src/i18n/locales/{code}.json`
- **Key 命名**: 采用嵌套结构或点分结构（目前为扁平或简单嵌套，需统一）。
- **规范**: 
    - 仅翻译 Value，Key 必须与 `en.json` 严格一致。
    - 占位符使用 `{{value}}` 格式（如有）。

### 2.2 内容文章 (Content/Articles)
存放位置：`src/content/articles/{code}/{slug}.md`
- **严禁回退**: 每个语言目录必须存在。如果对应语言目录下缺少 `slug.md`，页面将报错或显示 404。
- **Frontmatter 翻译**: 
    - `title`: 必须翻译。
    - `subtitle`: 必须翻译。
    - `category`: **保持英文 Key** 或建立映射（目前代码直接读取 string，建议保持英文用于逻辑判断，UI 显示时翻译）。*目前现状是直接显示，后续需优化*。
    - `heroImage`: 通常共用。

### 2.3 法律条款 (Legal)
存放位置：`src/content/legal/{code}/{slug}.md`
- 必须包含 `privacy.md` 和 `terms.md`。

## 3. ✍️ 翻译原则 (Translation Guidelines)

我们服务于 **Globol (Social/Dating)** 场景，翻译必须遵循以下“黄金法则”：

1.  **悦纳感 (Pleasantness)**: 拒绝冷冰冰的机器翻译。文案应传达轻松、浪漫、有趣的氛围。
    - *Bad*: "Date Ideas Data" -> "约会点子数据"
    - *Good*: "Date Ideas" -> "约会灵感" / "Ide Kencan" (Indonesian)
2.  **本地化 (Localization)**:
    - 货币符号、日期格式需适配当地习惯。
    - 习语转换：不要直译英语俚语，用当地等效表达。
3.  **一致性 (Consistency)**:
    - 品牌词 "Globol" 不翻译。
    - 核心功能词（如 "Date Ideas", "Download"）全站统一。

## 4. ✅ 验收标准 (Verification)

每次新增语言或发布新内容，必须通过以下检查：

### 4.1 自动化检查
- **路由连通性**: 访问 `/{locale}` 返回 200 OK。
- **HTML Lang**: `<html lang="{code}">` 属性正确。

### 4.2 关键页面人工核查
| 页面 | 检查点 |
|------|-------|
| **Home** | 导航栏、Hero Slogan、Footer 链接是否翻译。 |
| **List (Date Ideas)** | 文章标题是否为目标语言，"Read More" 按钮是否翻译。 |
| **Detail (Article)** | 标题、简介、正文是否流畅。不做“混合双语”（除非故意为之）。 |
| **Dating List** | 筛选器（Gender, Country）标签是否翻译。 |
| **Dating Profile** | "Say Hi", "About Me" 等标签是否翻译。 |

## 5. 🛠 常用指令 (Commands)
- **同步 Key**: 当 `en.json` 新增 Key 时，使用脚本同步到其他 14 个文件（Value 暂填英文）。
- **生成占位文章**: 使用脚本将 `en` 目录下的 Markdown 复制到新语言目录（仅用于防止报错，后续需覆盖翻译）。
