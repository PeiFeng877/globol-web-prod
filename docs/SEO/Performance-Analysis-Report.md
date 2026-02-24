# 首页性能指标不佳 — 综合分析报告

> 作者：Antigravity AI  
> 日期：2026-02-24  
> 范围：`globol.im` 首页 Core Web Vitals 劣化诊断

---

## 一、问题背景

Google Search Console (GSC) 的"页面体验"报告显示首页处于**"较差"**状态，核心指标（Core Web Vitals, CWV）未能通过评估。GSC 使用的是 **CrUX（Chrome User Experience Report）真实用户数据**，而非 PageSpeed Insights 的实验室模拟数据，因此即使 PSI 实验室分数好看，GSC 仍可判定性能不佳。

本报告从三个维度逐一评估：①站点自身代码问题、②Vercel 平台问题、③其他潜在因素。

---

## 二、维度一：网站自身代码问题

### 2.1 LCP（最大内容绘制）— 存在问题 ⚠️

**现象：** 首页 LCP 候选元素是 `<MainCarousel>` 中 `slide-1.webp` 的 `<Image>` 组件。

**代码层面发现的问题：**

#### ① `MainCarousel` 是 `'use client'` 组件
```tsx
// src/components/sections/MainCarousel.tsx
'use client';
// ...
const [isMounted, setIsMounted] = useState(false);
// SSR 阶段：visibleSlides = [slides[0]] ✅
// 但组件整体是客户端组件，图片 DOM 必须等 JS Bundle 下载并 Hydrate 后才能渲染
const visibleSlides = isMounted ? slides : [slides[0]];
```

**根本问题：** 虽然首屏只渲染 `slides[0]`，但 `MainCarousel` 是 `use client` 组件，这意味着：
- Next.js 会在 SSR 时输出 HTML（✅ 正确）
- 但浏览器必须等 `MainCarousel.js` bundle 加载完成并 Hydrate 后，图片组件才会完整触发
- `isMounted` 的 `useEffect` 机制会触发一次额外渲染，可能导致 Hydration 前后 DOM diff

**更大的核心问题：无法将 LCP 图片的 `<img>` 标签在纯 HTML 中提前输出。** Next.js 的 `<Image>` 组件在 `use client` 环境下，虽会做 SSR，但 `priority` 和 `fetchPriority="high"` 这些 hint 的效果依赖于 React Hydration 的时机。

#### ② `sizes` 属性与实际布局不符
```tsx
const imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
```

**问题：** 在 `md` 断点（768px~1024px）以上，图片实际占 `grid-cols-2` 的一半（约 50vw），但超过 1024px 后你设置的是 `33vw`。然而图片的 `max-w-[400px]` 限制意味着大屏上图片约为 400px。

实际上在移动端（`< 768px`），图片占据 `45vh`，宽度接近 `100vw` 但高度受限。这导致浏览器可能请求了过大或过小的图片，影响 LCP 加载速度。

#### ③ LCP 图片被包裹在 `'use client'` 组件内，`<link rel="preload">` 未被主动注入
Next.js 的 `priority={true}` 会在 SSR 时自动注入 `<link rel="preload">`，但这依赖 App Router 对 Server Component 的处理能力。当 `<Image>` 在 Client Component 内时，preload hint 可能不会出现在 `<head>` 中，这是一个已知的 Next.js 行为差异。

**验证方法：** 在 Chrome DevTools → Network 中查看 `slide-1.webp` 的请求优先级是否为 `Highest`，以及 `<head>` 中是否有对应的 `<link rel="preload">`。

---

### 2.2 CLS（累积布局偏移）— 潜在风险 ⚠️

**问题来源：** `Navbar` 被包裹在 `<Suspense fallback={...}>` 中：
```tsx
<Suspense fallback={<div className="h-20 bg-white/90 backdrop-blur border-b border-gray-100" />}>
  <Navbar />
</Suspense>
```
这是正确的 —— fallback 占位高度固定（`h-20`），不应造成 CLS。但如果 Navbar 内容的实际高度与 `h-20` 不完全一致，就会产生轻微偏移。

**另一个来源：** `inter` 字体使用了 `display: 'swap'`，字体加载时会有字体替换（FOUT），从而触发布局偏移，这是 CLS 的经典来源之一。

---

### 2.3 FID / INP（交互响应延迟）

**问题来源：** 首页 JS Bundle 加载了全量的 Analytics 脚本：
```tsx
<FirebaseAnalytics />
<SpeedInsights />
<Analytics />
<PageViewTracker />
```
Firebase Analytics SDK 较重（约 50KB gzipped），会在 TTI（可交互时间）前占用主线程，延迟响应用户交互。

---

### 2.4 自查结论

| 指标 | 评分 | 主要问题 |
|------|------|---------|
| LCP | 🔴 高风险 | Client Component 内的 LCP 图片，preload hint 可能丢失 |
| CLS | 🟡 中风险 | 字体 swap + Suspense fallback 高度一致性 |
| INP | 🟡 中风险 | Analytics 脚本占用主线程 |

---

## 三、维度二：Vercel 平台问题

### 3.1 Vercel 的架构特性与 TTFB 问题

**这是目前最可能导致 CrUX 真实数据差的根本原因之一。**

Vercel 使用 Edge Network，但其中有一个重要限制：

#### ① Node.js Serverless Function 的冷启动（Cold Start）
你的 Next.js App Router 使用 `withPayload` 包裹，这意味着**首页是一个 Serverless Function**，而不是从 CDN 边缘静态直出的 HTML。

每次冷启动（无流量的时间段后第一次访问）的 TTFB 可高达 **1~3 秒**。

**验证方法：** 在 GSC → Core Web Vitals 报告中查看 TTFB 数据，或使用 `curl -w "\n%{time_starttransfer}" https://www.globol.im/en` 测量。

#### ② 全球用户的地理延迟

Vercel 的 Serverless Functions 默认部署在 **iad1（美国弗吉尼亚）** 或 **sfo1（旧金山）**，离中国大陆、南亚、东南亚用户距离极远，往返延迟（RTT）可高达 **200~400ms**，加上你是国际社交应用，用户地理分布极广。

**这是真实用户 CrUX 数据差而实验室数据好的经典原因：** PageSpeed Insights 默认测试节点在美国，而你的真实用户分布在全球。

#### ③ Vercel Blob Storage 图片回源延迟

```tsx
// next.config.ts
remotePatterns: [
  { hostname: '*.public.blob.vercel-storage.com' },
]
```

Vercel Blob 节点主要集中在美国地区，非美用户访问这些图片时，Next.js Image Optimization（`/_next/image`）会先从 Vercel 的图片优化节点请求，再从 Blob 存储回源，形成两跳延迟。

但从代码看，首页的 LCP 图片（`slide-1.webp`）来自 `public/assets/`，是本地静态资源，这部分走 CDN 静态文件分发，不受此影响。

---

### 3.2 Vercel 的解决路径

| 问题 | 解决方案 |
|------|---------|
| 冷启动 | 开启 `Fluid Compute`（Vercel 新特性）或将首页改为 `export const revalidate = 3600` ISR 静态化 |
| 地理延迟 | 迁移 DB 至距离用户近的区域（如新加坡 `ap-southeast-1`）；或升级 Vercel Pro 并开启 Edge Middleware |
| Serverless 冷启动 | 对关键路由使用 `export const runtime = 'edge'` |

---

## 四、维度三：其他潜在因素

### 4.1 CrUX 数据代表性问题

CrUX 收集的是过去 **28 天**的真实 Chrome 用户数据。如果你的站点：
- 用户群体中有大量来自慢速网络（3G/4G）的移动端用户（发展中国家）
- 用户使用低端 Android 设备

那么 CrUX 数据会系统性偏低，即便你的服务器响应极快。这属于**用户群体问题**，不是技术问题。

### 4.2 第三方脚本

Firebase Analytics SDK、Vercel Analytics、SpeedInsights 等都会在首页加载，虽然它们通常不阻塞渲染，但在低端设备上仍会：
- 占用主线程解析时间（影响 INP）
- 增加网络请求并发数量

### 4.3 谷歌爬虫 vs 真实用户的区别

GSC 的 CWV 数据来自 CrUX，不是 Googlebot 爬取。Googlebot 爬取速度不等于用户体验速度。即使 Googlebot 能快速索引你的页面，CrUX 数据仍可能不佳。

---

## 五、综合判断

```
优先级排序（按影响大小）：
1. Vercel 冷启动 + 地理延迟（TTFB 高）           → 最大影响，需立即处理
2. LCP 图片 preload hint 在 Client Component 丢失  → 高影响，需验证并修复
3. Analytics 脚本影响 INP                          → 中等影响，工程优化
4. 字体 FOUT 导致 CLS                              → 低影响，可后续处理
```

**核心结论：** 你的问题是 **Vercel 平台问题 + 站点代码问题的复合体**。两者都有贡献，但 Vercel 的地理延迟和冷启动可能是主因。

---

## 六、优先修复行动清单

### 🔴 P0 — 立即执行

- [ ] **将首页改为 ISR 静态化**  
  在 `page.tsx` 中添加：
  ```tsx
  export const revalidate = 3600; // 每小时重新生成一次
  ```
  这将使首页从 Serverless Function 变为 CDN 静态文件，彻底消除冷启动。

- [ ] **将首页 LCP 图片迁出 `use client` 组件**  
  将 `<Image src="/assets/slide-1.webp" priority />` 作为一个独立的 Server Component 提取到首页顶层，用 CSS 定位叠加在 Carousel 上，确保浏览器在解析 HTML 时就看到 `<link rel="preload">`。

### 🟡 P1 — 本周内处理

- [ ] **验证 `<link rel="preload">` 是否存在于生产环境 HTML**  
  `curl -s https://www.globol.im/en | grep preload`

- [ ] **将 Firebase Analytics 改为异步延迟加载**  
  在 `FirebaseAnalytics.tsx` 中使用 `requestIdleCallback` 或 `setTimeout(init, 2000)` 延迟初始化。

- [ ] **修正 LCP 图片 `sizes` 属性**  
  ```tsx
  // 当前（不准确）
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  // 建议（更准确）
  "(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 400px"
  ```

### 🟢 P2 — 长期优化

- [ ] 评估 Vercel Pro 的 SKU 与 Edge Function 方案
- [ ] 考虑将图片存储从 Vercel Blob 迁移至更靠近目标用户的 CDN（如阿里云 OSS + CDN）
- [ ] 考虑对 `Inter` 字体使用 `font-display: optional` 替代 `swap`，消除 FOUT

---

## 七、附：快速验证命令

```bash
# 1. 测量 TTFB（多次执行）
curl -s -o /dev/null -w "TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" https://www.globol.im/en

# 2. 检查 preload hint
curl -s https://www.globol.im/en | grep -i 'preload'

# 3. 检查图片响应头缓存策略
curl -I https://www.globol.im/_next/static/media/slide-1.webp

# 4. 用 PageSpeed Insights API 抓取现场分快照
open "https://pagespeed.web.dev/report?url=https://www.globol.im/en"
```

---

> [!IMPORTANT]  
> **最关键的一步：** 先执行"快速验证命令"中的 TTFB 测量，如果 TTFB > 500ms，则优先处理 ISR 静态化（P0 第一条），这一个改动即可让 LCP 分数大幅提升。
