# 核心系统架构与内容工作流 (Core System Architecture & Workflow)
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md

本文档旨在统一阐述当前 Globol 网站的底层技术选型、数据库选型原因、SEO 性能设计以及核心的内容运营发布流程。

## 1. 技术栈大盘与环境解耦

本项目的核心哲学是**「应用代码」**与**「业务数据」**的彻底物理隔离。

- **前端与路由**: Next.js 16 (App Router)
- **部署与前端托管**: Vercel (Hobby)
- **内容管理中枢 (CMS)**: Payload CMS 3.0 (无缝集成进 Next.js 后端)
- **对象存储 (媒体库)**: Vercel Blob (图片通过 CDN 分发)
- **核心数据库 (数据层)**: **强烈推荐 Supabase (基于 AWS)**（而不使用 Vercel Postgres 服务）

### 部署与内容互相覆盖的终极解答
1. **本地环境部署 Vercel 覆盖了正式服内容？**
   **绝对不会。** Payload 的文章和配置保存在数据库和 Blob 里，Vercel 的 `vercel --prod` 部署构建**只会拉取 GitHub 的前端页面代码并重启容器**，不会触碰数据库里的哪怕一个标点符号。因此，发布新代码版本绝不会影响到您已经在后台辛苦撰写的文章。
2. **测试服修改导致正式服混乱？**
   **不会发生。** 只要本地的环境变量（`.env.local`）指向的是测试用数据库（例如本地的 localhost Postgres 或者另外开的一个 Dev DB），你的胡作非为绝不会同步到生产库。环境变量是两套系统彻底隔离的唯一锁钥。

---

## 2. 数据库选型：为何坚决使用 Supabase 而非 Vercel？

您曾经准确回忆起我们的沟通：Vercel Postgres 本质上是外包了 Neon DB 等底层服务商，并赚取了高昂差价。如果我们要为了后续发力 **大规模 programmatic SEO (pSEO)**，数据库选型至关重要。

### Vercel Postgres 的死穴：内容扩展性危机
- **成本与限制极度苛刻**：Vercel 的基础版数据库只有极其微薄的配额（如计算时长 Compute Hours 的极速消耗）。
- **容量触达引发的宕机**：如果在短时间内用 AI 生成并存储了上千个长尾页面的 pSEO 内容，你会很快触达 Vercel 的计费红线，轻则收到极其昂贵的账单，重则业务会被锁定。

### Supabase 的压倒性优势与正确姿势
- **高性价比的海量承载力**：Supabase 本身是独立的后端云服务（底层运行在 AWS 或 GCP 上）。免费版上限宽容，后续 $25/月的付费计划足以支撑数万篇高负载 pSEO 文章和复杂的 PGVector AI 向量检索，无计算时长限制。
- **配置与 Vercel 完美同频（消除延迟）**：
  只要你在创建 Supabase 数据库时，**选择的服务器机房地区与 Vercel Serverless Function 所在的机房一致（例如美国东部 AWS `us-east-1` 弗吉尼亚州）**，两者之间的数据请求就等于跑在同一个亚马逊数据中心的内网里，延迟（Latency）仅为 1-5 毫秒。

### Supabase 会导致用户访问网页或者 SEO 变慢吗？
**完全不会！原因在于 Next.js 的静态生成机制：**
- 真实用户或 Googlebot 在访问 `globol.im` 时，他们**根本没有连接任何数据库**，而是直接从离他们所在地最近的 Vercel 边境节点（Edge CDN）下载一份纯静态 HTML，TTFB 是极速的。
- 只有你在写文章那一秒，或者后台触发 HTML 重新生成时，服务器才会去找 Supabase 要数据。这对大众访问速度可谓毫无干涉。

---

## 3. SEO 极致加载机制 (SSG + ISR)

既然数据全部推上了云数据库，那当你发布了一篇新文章，网站是如何感知并更新 SEO 的？

### 定时背景刷新 (Incremental Static Regeneration - 60秒)
我们已经在列表页（`/date-ideas`）和文章详情页全部启用了 `export const revalidate = 60;`。
1. **永不卡顿**：任何时间点，当用户访问这些页面，Next.js 会极其迅速（0毫秒等待底库）地秒速返回现有缓存好的 HTML。
2. **背景静默重绘**：如果你刚在 Payload 推了一篇新文，过了 60 秒后有游客来访，Next.js 会扔给游客旧的缓存（保证他不卡），同时偷偷在后台找 Supabase 索取最新数据，然后将全球节点的旧缓存替换掉。
3. **牵一发而动全身**：不管你的新文章在多少个推荐位露出，只要在这 60 秒触发了重新验证，首页、关联流、所有链接将**在后台一次性自动全网刷新**。你再也无需去 Vercel 点 Deploy 重构。

### Sitemap.xml 强动态响应 (Force Dynamic)
对于 Google 爬虫最重要的导航灯塔 `/sitemap.xml`，我们采用了 `force-dynamic`。
也就是说，在你后台按下“发布”按键的那一个绝对瞬间，爬虫过来抓 Sitemap，返回的链接池就是 100% 增加好的，绝对实时，不错过哪怕一秒的收录窗口。

---

## 4. 技术 SEO 基石规范

- **一页一 H1 铁律**：整站架构严格杜绝多个 H1 的乱用，轮播图等大字组件强制降级为 H2，只有当页核心命题使用 H1 标签。
- **URL 无尾斜杠硬性收敛**：强制处理了 `trailingSlash: false`，使得 `globol.im/date-ideas` 和 `/date-ideas/` 不会产生 `308 Permanent Redirect` 损害权威。
- **规范链接 (Canonical) 与多语言关联 (Hreflang)**：
   自动注入 `<link rel="canonical">` 和包含不同语言入口交叉链接的 `hreflang`，向 Google 清晰宣告多语言版图，根除“内容重复 (Duplicate Content)” 危险。

---

## 5. 多语言文章的一键出版工作流

由于摒弃了传统的“字段级多语言”，现在的结构极其扁平清爽。每一篇文章（不论什么语种），都是一条各自独立的数据。它们通过**同一个 `translationGroupId` 标签**，如同一串珍珠项链的棉线一样穿接起来。

### 日常运营规程 (SOP)
1. **新建母语范本**：在后台 `Articles` 里，创建母语（例如 English）文章。
2. **分配全局身份 ID (Slug/Tag)**：给它一个所有语言共用的 `translationGroupId`（建议使用该文章主题的纯小写英文，例如：`cheap-date-ideas-guide`），并且将这篇英文原文存好图片，发布上线。
3. **触发自动化扩展体系 (预案规划)**：
   - 依赖 Payload 的生命周期钩子（AfterChange Hook），或者直接后台点击“生成多语言”。
   - 服务器将该 `cheap-date-ideas-guide` 下属对应的英文母版标题、内容打包扔给大语言模型 API 做定向地缘语义翻译。
   - 收到译文后，服务器在一个循环里，直接调用 14 次底层 `payload.create()` 并指派对应 `language` label，且把同样的 `translationGroupId` 打在这 14 个新生儿头上。
   - 至此，14 篇异国语言文章连同多语言交叉 SEO 会瞬间点亮。
4. **长效维护**：如果未来你想局部改一下这篇源语言内容，过滤出同一 `translationGroupId` 的所有衍生体，只需系统级比对差异内容后，调用 `payload.update()` 下发全量覆写即可。

## 6. 站点经营防爆雷区
1. **收录后请勿删文 (404 困境)**
   如果一篇文章已被 Google 收录并拥有了外部搜索流量，**坚决不要图省事删除该条记录！** 这会导致大流量黑洞（返回 404）。妥善做法：隐藏至下线状态，并在 `next.config.ts` 里将它的旧 URL 配置 `301 重定向` 引流到其他相关安全页面。
2. **确保多语言 Slug (路由名) 同源**
   如果法文版叫 `idées-de-rendez-vous`、日文叫 `%e3%83%87` 会造成系统解析严重灾难。务必让同一 `translationGroupId` 下的 15 篇文章共享**一模一样的基础英文 Slug**。
