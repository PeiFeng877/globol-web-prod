# SEO 审计与验收记录
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

日期: 2026-02-05
项目: Globol 官方网站
范围: 全站 SEO 结构与内容可索引性（App Router + i18n + Markdown 内容）

## 1. 使用方式
- 本文档用于记录 SEO 问题、修复与验收结论。
- 每个问题一行，按严重度排序，修复后填写“修复说明”“验收结果”“验收日期”。
- 验收完成后可删除本文件。

## 2. 验收口径
- 页面可被索引，且不存在无意义重复 URL。
- 语言版本互相正确指向（canonical 与 hreflang 一致）。
- 关键入口与内容可被发现（导航、内链、sitemap）。
- 元数据覆盖主要入口（title/description/OG/Twitter）。

## 3. 发现列表（按严重度）

| ID | 严重度 | 问题 | 影响 | 证据 | 修复说明 | 负责人 | 状态 | 验收结果 | 验收日期 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H-01 | 高 | `<html lang>` 固定为 `en`，中文页语言标注错误 | 语言识别错误，影响索引与 hreflang 互认 | `src/app/layout.tsx`, `src/middleware.ts` | 中间件写入 `x-locale`，RootLayout 读取并设置 `<html lang>` |  | 已修复 | 中英文页面 `lang` 与语言一致 | 2026-02-05 |
| H-02 | 高 | `international-dating` 路由冲突导致性别筛选页 404 | 重要入口无法索引 | `src/app/[locale]/international-dating/profile/[name]/page.tsx`, `src/app/[locale]/international-dating/[[...slug]]/page.tsx` | 人物详情迁移到 `/international-dating/profile/[name]`，更新内部链接与 canonical/hreflang |  | 已修复 | 筛选页不再与人物页冲突，404 消失 | 2026-02-05 |
| H-03 | 高 | 关键入口被隐藏且 sitemap 未覆盖国际交友页面 | 爬虫发现与索引不足 | `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/app/sitemap.ts` | 按当前需求保留隐藏与不收录策略 |  | 暂缓（需求保留） | 入口与 sitemap 继续隐藏，避免未完成页面被索引 | 2026-02-05 |
| H-04 | 高 | sitemap 缺失 About/Contact/Privacy/Terms 等大量页面 | 索引覆盖率显著不足 | `src/app/sitemap.ts` | 新增 About/Contact/Privacy/Terms 多语言 sitemap 条目 |  | 已修复 | sitemap 覆盖核心静态页面 | 2026-02-05 |
| H-05 | 高 | 页脚多语言内链未本地化 | 中文站权重分配受损 | `src/components/layout/Footer.tsx` | 页脚所有内链改为 `getLocalizedLink` |  | 已修复 | 中文页内链指向 `/zh/...` | 2026-02-05 |
| M-01 | 中 | `date-ideas` canonical 与实际 URL 不一致 | 重复信号与去重错误 | `src/app/[locale]/date-ideas/page.tsx` | canonical 统一为 `en:/date-ideas`、`zh:/zh/date-ideas` |  | 已修复 | 去重信号一致 | 2026-02-05 |
| M-02 | 中 | About/Contact/Privacy/Terms 缺少 canonical 与 hreflang | 语言重复页风险 | `src/app/[locale]/about/page.tsx`, `src/app/[locale]/contact/page.tsx`, `src/app/[locale]/privacy/page.tsx`, `src/app/[locale]/terms/page.tsx` | 增加 canonical 与 `x-default/en/zh` alternates |  | 已修复 | 语言互指正确 | 2026-02-05 |
| M-03 | 中 | 关键页面 description 未本地化或缺失 | CTR 下降 | `src/i18n/locales/en.json`, `src/i18n/locales/zh.json`, `src/app/[locale]/page.tsx`, `src/app/[locale]/date-ideas/page.tsx`, `src/app/[locale]/contact/page.tsx`, `src/app/[locale]/privacy/page.tsx`, `src/app/[locale]/terms/page.tsx` | 新增 `seo` 文案键并用于 metadata |  | 已修复 | 关键页面描述已本地化 | 2026-02-05 |
| M-04 | 中 | 国际交友筛选页可能生成大量无结果页 | 软 404 风险 | `src/app/[locale]/international-dating/[[...slug]]/page.tsx` | 仅生成有数据的筛选组合，无结果直接 404 |  | 已修复 | 避免无结果页被索引 | 2026-02-05 |
| L-01 | 低 | 文章图片 alt 仍为 TODO 占位 | 图片搜索与可访问性弱 | `src/content/articles/en/at-home-date-night-ideas.md` | 替换为描述性 alt 文本 |  | 已修复 | 图片可访问性提升 | 2026-02-05 |
| L-02 | 低 | 多数页面缺少 OG/Twitter 图片 | 社交分享展示弱 | `src/app/[locale]/about/page.tsx`, `src/app/[locale]/contact/page.tsx`, `src/app/[locale]/privacy/page.tsx`, `src/app/[locale]/terms/page.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/date-ideas/page.tsx` | 增加默认 OG/Twitter 图片 |  | 已修复 | 社交分享卡片有图 | 2026-02-05 |

## 4. 验收步骤（建议）
1. 修复后访问目标页面，检查 `<html lang>` 与当前语言一致。
2. 检查 canonical 与 hreflang 是否指向实际可访问 URL。
3. 打开 `sitemap.xml`，确认新增页面已被纳入。
4. 使用浏览器查看页面 title/description/OG/Twitter 是否正确。
5. 验证国际交友筛选页可访问且不 404。

## 5. 结论
- 当前为初始基线记录，待逐条修复与验收后更新状态。
