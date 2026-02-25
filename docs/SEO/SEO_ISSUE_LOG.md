# SEO 问题历史日志 (SEO Issue Log)
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

> **文档目标**: 记录 Globol 项目曾经发现和处理过的所有 SEO 问题，防止相同问题在功能迭代中复发。  
> **更新规范**: 每次修复 SEO 问题后，必须在本文档中追加一条记录。  
> **格式**: 问题描述 → 根因 → 修复方法 → 预防机制

---

## Issue #001 - Sitemap 含重复 URL（非规范协议/路径变体）
**发现日期**: 2026-02-12  
**严重程度**: 🔴 高  
**来源**: Semrush SEO 审计

### 问题描述
Sitemap.xml 中同时输出了 `https://` 和无协议前缀的 URL，以及多语言路径的多种变体（如 `/en/` 和 `/`），导致 Google 将它们识别为重复内容。

### 根本原因
`sitemap.ts` 使用了 `process.env.NEXT_PUBLIC_BASE_URL` 作为域名基础，在不同环境下可能被设置为不同值（如 `http://` 或者无 www）。

### 修复方法
1. 在 `src/lib/constants.ts` 中写死 `BASE_URL = 'https://www.globol.im'`，不再读取环境变量。
2. `sitemap.ts` 统一从 `BASE_URL` 构建所有 URL，保证协议和域名一致。

### 预防机制
- **规则**: `BASE_URL` 永远不得从环境变量读取，必须是硬编码的 www + https 域名。
- **检查方法**: `curl https://www.globol.im/sitemap.xml | grep "http://"` 期望无输出。

---

## Issue #002 - Sitemap URL 末尾含尾斜杠，触发 308 重定向
**发现日期**: 2026-02-12  
**严重程度**: 🔴 高  
**来源**: Google Search Console（重定向原因导致未建立索引）

### 问题描述
Sitemap 和 hreflang 标签中输出了带尾斜杠的 URL（如 `https://www.globol.im/zh/`），Next.js 默认 `trailingSlash: false`，访问这些 URL 会触发 308 永久重定向到不带斜杠的版本，导致 Google 认为 Sitemap 中的 URL 是"重定向页"而不建立索引。

### 根本原因
早期 Sitemap 生成逻辑使用了字符串拼接且未做统一处理，部分路径末尾带有 `/`。

### 修复方法
1. 在 `sitemap.ts` 中封装 `localizedUrl()` 工具函数，统一构建不含尾斜杠的规范 URL。
2. 在 `generateMetadata()` 的 `alternates.canonical` 中同步确保不含尾斜杠。

### 预防机制
- **规则**: 任何硬编码 URL 字符串（Sitemap、canonical、hreflang）末尾均不得有 `/`，根路径 `/` 除外。
- **检查方法**: `curl https://www.globol.im/sitemap.xml | grep -E "loc>.*/$"` 期望无输出（除首页）。

---

## Issue #003 - `<html lang>` 属性全局硬编码为 `"en"`
**发现日期**: 2026-02-23  
**严重程度**: 🔴 高  
**来源**: 内部代码审计

### 问题描述
根布局文件 `src/app/(app)/layout.tsx` 中写死了 `<html lang="en">`。由于 Next.js App Router 机制，无论访问的是哪个多语言页面（`/zh/`、`/es/` 等），浏览器和搜索引擎爬虫获取到的 HTML 始终声明自己是英语页面。这与页面的实际内容语言完全矛盾，对多语言 SEO 权重造成严重损害。

### 根本原因
布局文件的层级拆分问题：全局 `<html>` 骨架放在了不知道当前 `locale` 的父级 Layout 中，导致无法动态设置语言。

### 修复方法
将 `(app)/layout.tsx`（全局 HTML 骨架）和 `[locale]/layout.tsx`（多语言 i18n 注入）合并，由带有 `locale` 参数的 Layout 统一负责输出 `<html lang={locale}>`。

### 预防机制
- **规则**: `<html>` 标签必须位于能访问到 `locale` 参数的 Layout 层级中，不得在 `(app)/layout.tsx` 等无 locale 参数的文件中定义 `<html>`。
- **检查方法**: 执行 `curl -s https://www.globol.im/zh | grep -o '<html[^>]*>'`，输出应为 `<html lang="zh">`。

---

## Issue #004 - Google Search Console 报告大量"因重定向未建立索引"
**发现日期**: 2026-02-23  
**严重程度**: 🟡 中  
**来源**: Google Search Console（覆盖率报告）

### 问题描述
GSC 报告了 412 个因重定向导致未建立索引的页面，URL 涵盖：
- `http://globol.im/...` 和 `https://globol.im/...`（无 www）
- `https://www.globol.im/zh/`（带尾斜杠）
- `https://www.globol.im/privacy/` 和 `/terms/`（302 跳转 CDN）
- `https://www.globol.im/zh-TW/...` 和 `zh-CN/`（不支持的 locale 变体）

### 根本原因
这些 URL **本身的重定向行为是正确的**，根本问题是站点历史上曾将这些非规范 URL 泄露给爬虫（通过旧版 Sitemap 或 hreflang 标签），导致 Google 误认为这些应该是独立有效页面。具体归因：

| URL 类型 | 触发来源 |
|---|---|
| non-www | 早期部署时配置了两个域名均有效 |
| 尾斜杠 | Issue #002 修复前的旧版 Sitemap |
| privacy/terms | 早期曾在 Sitemap 中包含这两个路径 |
| zh-TW/zh-CN | 早期 hreflang 标签输出了非标准 locale 代码 |

### 修复方法
1. 确保 `next.config.ts` 明确声明 `trailingSlash: false`，防止行为随 Next.js 升级漂移。
2. 确保 `sitemap.ts` 不含 `privacy`、`terms` 路径。
3. 确保 `i18n/settings.ts` 中只声明官方支持的 locale 代码（如 `zh` 而非 `zh-CN`/`zh-TW`）。
4. GSC 侧：通过「URL 检查」工具对各语言主要页面申请重新索引，加速 Google 纠正。

### 预防机制
- **规则**: Sitemap 中只能包含在 `i18n/settings.ts` `locales` 数组中声明的 locale，且不包含会被 redirect 的路由（如 privacy/terms）。
- **Sitemap 不应包含的路径**: `privacy`, `terms`（这两个路径走 302 CDN 跳转）。
- **检查方法**: `curl https://www.globol.im/sitemap.xml | grep -E "(privacy|terms)"` 期望无输出。

---

## Issue #005 - BreadcrumbList Schema 缺少 "name" 或 "item.name" 属性
**发现日期**: 2026-02-23  
**严重程度**: 🟡 中 (导致对应页面的面包屑富摘要失效)  
**来源**: Google Search Console (结构化数据未通过解析)  

### 问题描述
Google Search Console 报错提示 `/ko/international-dating/woman` 等页面的 BreadcrumbList 结构化数据解析失败，错误原因为 `itemListElement` 中的条目应指定 "name" 或 "item.name"。这导致页面在搜索结果中无法展示层次清晰的面包屑导航。

### 根本原因
在处理 BreadcrumbList schema 的生成逻辑时，部分字段赋值错误。以 `src/app/(app)/[locale]/international-dating/[[...slug]]/page.tsx` 为例，代码在向 `breadcrumbs` 数组追加 `gender` 和 `country` 层级时，错误地直接展开了属性：
```typescript
// 错误示范：
breadcrumbs.push({
  '@type': 'ListItem',
  position: 3,
  name: gender === 'man' ? t.common.men : t.common.women,
  item: `${baseUrl}${datingLink}/${gender}`
});
```
根据 Schema.org/BreadcrumbList 规范，`itemListElement` 数组中的元素虽然是 `ListItem`，但如果不包裹一个完整的 URL/名称节点，Google 解析器便严格拒收。

### 修复方法
排查所有输出 `BreadcrumbList` 的页面（主要为 `date-ideas/[slug]`、`international-dating/[[...slug]]` 和 `international-dating/profile/[name]`）。修正 `itemListElement` 内部子项的结构对齐：

*(注：下述步骤为排查出的需要代码实施的地方，当前文档仅记录架构缺陷。)*
- 检查 `ListItem` 的 `item` 属性是否正确包裹，或者是将 `name` 严格赋给了正确的层级。实际上，上述截图反映的问题在于 `item.name` 与顶层 `name` 的结构性混用。正确的写法应当确保向后兼容所有 schema 解析器：
```typescript
{
  '@type': 'ListItem',
  position: 1,
  name: "Home",     // 必须提供
  item: "https://globol.im/" // URL
}
```
经过仔细审查上述代码，发现问题其实在于 `Next.js` 输出的 JSON 被 Google 抓取时的部分非标准 URL 导致其退回验证。我们需要确保所有的 `item` (URL) 和 `name` 都绝对保证非空。

*(真正的代码漏洞诊断)*：在 `international-dating/[[...slug]]/page.tsx` 中：
```typescript
  if (gender) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: gender === 'man' ? t.common.men : t.common.women,  // <-- 如果 t.common 字典中缺失这些 key，name 就会变成 undefined/空！
      item: `${baseUrl}${datingLink}/${gender}`
    });
  }
```
并且在使用 `sampleProfile?.countryDisplay?.[locale]` 时，如果匹配不到，`name` 也变成了不合法的值。这就解释了为什么偏偏在特定的过滤路径下 GSC 会报错。

### 预防机制
- **规则**: 任何 JSON-LD 结构化数据在输出前，必须提供有效的 Fallback 兜底方案。尤其涉及到从 i18n 字典读取动态 `name` 时（如 `${t.common.men || 'Men'}`）。
- **检查方法**: 上线前，选取动态生成的页面 URL 放进 [Google 结构化数据测试工具 (Rich Results Test)](https://search.google.com/test/rich-results) 跑一遍，确保 `BreadcrumbList` 完全变绿。

---

## 预防检查清单 (Pre-deployment SEO Checklist)

每次功能迭代上线前，必须快速执行以下检查：

```bash
# 1. Sitemap 不含尾斜杠（除根路径）
curl -s https://www.globol.im/sitemap.xml | grep -E "<loc>.*[^/]/$" && echo "❌ 发现尾斜杠问题" || echo "✅ 尾斜杠检查通过"

# 2. Sitemap 不含 privacy/terms
curl -s https://www.globol.im/sitemap.xml | grep -E "(privacy|terms)" && echo "❌ Sitemap 含 privacy/terms，需移除" || echo "✅ 隐私条款检查通过"

# 3. 中文页面 lang 属性正确
curl -s https://www.globol.im/zh | grep -o '<html[^>]*>' | grep 'lang="zh"' && echo "✅ lang 属性正确" || echo "❌ lang 属性错误，检查 layout"

# 4. 尾斜杠 URL 正确重定向（期望 200，不是 301/308）
STATUS=$(curl -Ls -o /dev/null -w "%{http_code}" "https://www.globol.im/zh")
[ "$STATUS" = "200" ] && echo "✅ /zh 状态码 $STATUS" || echo "❌ /zh 状态码 $STATUS"

# 5. 带尾斜杠正确重定向
FINAL_URL=$(curl -Ls -o /dev/null -w "%{url_effective}" "https://www.globol.im/zh/")
[ "$FINAL_URL" = "https://www.globol.im/zh" ] && echo "✅ 尾斜杠重定向正确" || echo "❌ 尾斜杠重定向落点: $FINAL_URL"

# 6. BreadcrumbList Schema 'name' 字段非空检查
curl -s https://www.globol.im/ko/international-dating/woman | grep -q '"name":""\|"name":undefined\|"name":null' && echo "❌ 发现不合法的 JSON-LD name 属性" || echo "✅ 面包屑 name 字段检查通过"
```
