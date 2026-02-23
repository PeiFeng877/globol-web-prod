# 测试规范 (Testing Standard)
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

## 概述

本项目使用 **Playwright** 进行 E2E 测试，覆盖四大维度：

| 维度 | Tag | 用例数 | 脚本文件 |
|---|---|---|---|
| 冒烟测试 | `@smoke` | 12 | `tests/smoke.spec.ts` |
| 内容验证 | `@content` | 6 | `tests/content.spec.ts` |
| 多语言 | `@i18n` | 7 | `tests/i18n.spec.ts` |
| SEO | `@seo` | 14 | `tests/seo.spec.ts` |

---

## 命令速查

```bash
# 全量测试
npm test

# 按维度
npm run test:smoke
npm run test:content
npm run test:i18n
npm run test:seo

# 查看 HTML 报告
npx playwright show-report
```

---

## 小变更测试流程

**触发时机**：每次 PR、功能开发完成后。

| 步骤 | 内容 | 必须 |
|---|---|---|
| 1 | `npm run build` 无报错 | ✅ |
| 2 | 运行影响范围内的 Tag 测试 | ✅ |
| 3 | 本地 `npm run dev` 人工验证改动页面 | 推荐 |

**影响范围判断**：

| 改动范围 | 需跑的 Tag |
|---|---|
| 文章页面 / CMS 内容 | `@smoke` + `@content` |
| 国际化字典 / 路由 | `@smoke` + `@i18n` |
| SEO meta / JSON-LD / sitemap | `@smoke` + `@seo` |
| 组件样式 / 布局 | `@smoke` |
| 数据层 (profiles) | `@smoke` + `@content` |

---

## 大发版 / 上线前测试流程

**触发时机**：推到正式服之前。

| 步骤 | 内容 | 必须 |
|---|---|---|
| 1 | `npm run build` 无报错 | ✅ |
| 2 | `npm test` 全量测试通过 | ✅ |
| 3 | 检查 `playwright-report/` 报告，确认无失败项 | ✅ |
| 4 | 人工抽检 3 个关键页面（首页、文章详情、Dating） | 推荐 |
| 5 | Lighthouse SEO 评分 ≥ 90（生产环境） | 推荐 |

---

## 编写新测试用例规范

1. 文件放在 `tests/` 目录，按维度命名：`smoke.spec.ts`、`content.spec.ts`、`i18n.spec.ts`、`seo.spec.ts`
2. 每个 `test()` 的描述必须包含编号和 Tag，格式：`'E15: 新用例名称 @seo'`
3. 优先使用 `page.locator()` 精确定位元素，避免依赖动态 class
4. 不在测试中硬编码完整 URL，使用 `baseURL` 相对路径
5. 图片验证检查 `src` 属性非空，不做外部 HTTP 请求

---

## 变更日志

- 2026-02-22: 初始建立测试规范文档。
