# 07 - Image ALT 多语言与 AI 生成策略

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md

## 1. 现象层 (Phenomenon)
**症状：** 图片通过 CMS 上传至云存储后，`alt` 属性大片空白；在多语言架构下，同一张图片在不同语种页面中难以锚定准确的语义描述。
**痛点：** 手工为成百上千张图填写不同语言的 ALT 描述极速恶化运营效率，且极易遗漏；若多语言页面共享同一语言的 ALT，将直接导致搜索引擎（如 Google Image）索引错乱，流量获取能力断崖式坠落。

## 2. 本质层 (Essence)
**问题本质：** 视觉数据向文本语义空间的降维投影缺失，且未能与当前页面的语言上下文（`<html lang="xxx">`）相绑定。
**架构根因：**
1. CMS (Payload) 数据流中缺乏自动富化机制，无人在上传生命周期介入。
2. Media Collection 的 `alt` 字段未开启 `localized: true` 配置，结构上拒绝了多态表达。
**影响：** Google 图片搜索流量流失殆尽；页面整体上下文相关性评分受损。

## 3. 哲学层 (Philosophy)
**理念：** 让机器向机器解释世界。人类只颁布规则，不承担任何低效的穷举劳动。
**准则：**
- **数据单向流动与自动化富化：** 图片上传 -> 触发 Hook -> Vercel AI Gateway -> 结构化描述 -> 分发回填多语言 -> 最终持久化。无手工干预。
- **上下文一致性铁律：** 图像本身没有母语，但承载它的页面有。ALT 文本必须是页面语言生态的固有部分，不能游离于 `lang` 属性之外。

## 4. 全链路业务流转架构 (End-to-End Workflow)

基于基础设施成本管控与百炼官方 API 的稳定性原则，我们**彻底放弃 Vercel AI Gateway (仅服务于 C 端线上用户)**，转而在 CMS 后台构建一套直连阿里云 DashScope (百炼) 官方 API 的内部专用生成链路。模型选定为高性能且极具性价比的 `qwen3-vl-flash-2026-01-22`。

### 4.1 Step 1: 图片上传生命周期 (Image Upload)
运营人员在 Payload CMS 后端上传图片，触发 `Media` Collection 的 `beforeChange` Hook。
此时数据流分岔为两种环境态：
- **云端环境 (Cloud)**：图片已被文件存储适配器（如 S3/OSS/Vercel Blob）接管，系统获取到了该图片的**公有读公网 URL**。
- **本地环境 (Local)**：图片仅存在于本机的内存/临时磁盘中（`/media`），系统截获了上传的 `req.file.data` (Buffer 格式二进制流)。

### 4.2 Step 2: 触发 Qwen3-VL 视觉感知 (Data Feeding)
若侦测到图片缺少 `alt` 描述，系统将通过原生的 `fetch` 直连阿里云 DashScope 通用视觉 API (`https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`)。

**自适应路由与装载：**
- **针对云端公网图**：构造极简 payload：`{"image": "https://cdn.globol.com/media/xxx.jpg"}`，利用云厂商之间的内部骨干网去拉取图片，极大削减本地内存压力与网络耗时。
- **针对本机测试图**：将 Buffer 转码为 `data:image/jpeg;base64,...` 的 Data URI，以 Base64 全量文本强行推送给阿里云。
*注：逻辑上在代码层面通过判断环境变量 `NODE_ENV === 'production'` 加上 `url` 存在与否实现无缝自适应切换。*

### 4.3 Step 3: 限定结构化输出方案 (JSON ALT Generation)
系统 Prompt 必须严厉限制输出格式：**不仅提取文字，并且一次性感知并输出本项目要求的所有多语言上下文（至少基准中英）**。

请求中应附加约束，要求 `qwen3-vl-flash-2026-01-22` 直出 JSON：
```json
// Qwen3-VL 预期输出
{
  "en": "A couple enjoying coffee at a sunny outdoor cafe in Paris.",
  "zh": "一对情侣正在阳光明媚的巴黎室外咖啡馆享用咖啡。"
}
```

### 4.4 Step 4: 多语言 ALT 分别保存 (Localized Storage)
CMS 数据 Schema 层必须捍卫多语言隔离。在 `src/collections/Media.ts` 中设定：
```typescript
{
  name: 'alt',
  type: 'text',
  localized: true, // 开启该字段的多语言独立存储
}
```
Payload 的 `beforeChange` Hook 在拿到 DashScope 返回的上述 JSON 后，不能直接赋值，而是作为多态对象回填：
```javascript
// Payload 内部多语言赋值特性
data.alt = {
  en: aiResponse.en,
  zh: aiResponse.zh
}
```
此时一次数据库的落盘 (Insert/Update) 动作，就凭空填补了所有受支持语言的 ALT 描述，无需人类参与。

### 4.5 Step 5: 前端多语言业务消费 (Frontend Retrieval)
当构建诸如 `src/app/[locale]/date-ideas/page.tsx` 这类前台页面时：
- Payload 提供的 REST/GraphQL API 或者 Local API 已经内建了基于语言包的回落与精确获取能力。
- 前端发起的网络请求（或组件内的服务端获取）只需带上当前的上下文字语种（如传递 `locale: 'zh'` 参数）。
- 返回的 `media.alt` 属性在抵达前端时，**已经被 Payload 降维剥离出唯一的正确结果**（即直接拿到字符串，而不是对象）。
- 最终渲染 `<Image src={media.url} alt={media.alt} />` 完美遵守了 `<html lang="xxx">` 上下文相关的 SEO 铁律。

## 5. 结论
通过直连阿里云 DashScope 并选用更强更快的 `qwen3-vl-flash-2026-01-22`，配合 Payload CMS 本身强大的 Hook 拦截和字段的 `localized: true` 特性，系统完成了一场从**“获取视觉数据” -> “AI 自适应云端跨模计算” -> “多语言一次性分裂与结构化存储” -> “客户端无感精准消费”** 的全自动 SEO 闭环。人类仅仅只需点击一次“上传图片”。
