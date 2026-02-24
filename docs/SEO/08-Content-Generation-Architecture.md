# 08 - SEO 规模化内容生成与分发架构 (Content Generation & Distribution Architecture)

[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

## 1. 业务背景 (Background)
随着站点从单一静态发布向 Programmatic SEO (pSEO) 及高频内容营销演进，靠人力在前端源码或 Payload CMS 后台逐篇手写文章已无法满足流量爆发需求。我们需要一套**规模化、自动化且独立于核心 Web 应用**的生成管线。

核心原则：
- **Web 端解耦**：前端工程 (`globol-web`) 应当且仅应当是一个性能怪兽般的“渲染引擎”和“数据出口”。极度消耗资源、时间与逻辑的“内容生发”工程，必须剥离到外部工具系统，绝不增加主项目的构建与运行负担。
- **系统间通信**：外部工具栈（比如独立配置的 AI 工作流工具、Dify、Coze、或自研 Python/Node 脚本）生成完备的结构化数据后，通过标准化的 API 推入核心站点的 CMS。

## 2. 字段映射：现状 vs 理想 SEO 雏形 (Fields Gap Analysis)

我们对比了当前 `src/collections/Articles.ts` 中的字段与一篇能制霸 Google 的理想 SEO 长文标准，以指导外部生成系统的数据装配：

| 领域 | 理想的 SEO 字段要求 | 当前系统现状 (`Articles.ts`) | 结论与对齐策略 |
| :--- | :--- | :--- | :--- |
| **基础文本** | `title` (H1), `description` (Meta, 150字内), `content` (含 H2/H3 的结构化 Markdown 文本/HTML) | 都有。但 `content` 在 CMS 里是 `richText`。 | ✅ 基本对齐。外部写入时需确保 `richText` 或 `markdown` 数据结构兼容。 |
| **层级与分类** | `category`, `tags` (利于内部链接锚点构建) | 仅有 `category`。 | ⚠️ 建议增强：在 AI 生成时，必须打上利于 URL 聚类的 Tags 并在后续模型修改中支持。 |
| **SEO 丰富度** | `faqs` (生成 FAQPage Schema 抢夺零位置) | 已支持 `faqs` (Array)。 | ✅ 优势。外部管线在生成正文后，强制要求 AI 总结 3 个 Q&A 填入此数组。 |
| **信任度 (E-E-A-T)**| 明确的 `author` 实体（含姓名、背景、社媒）。 | 有 `author` (关联 `users`)。但现阶段只是后台管理员。 | ❌ 核心缺失。见第 3 节。必须构建虚拟作者矩阵。 |
| **多语言映射** | 支持 15 语言，且各语言必须通过唯一 ID (`translationGroupId`) 绑定，宣告互相为 `hreflang`。 | 已支持 `language` 和 `translationGroupId`。 | ✅ 极佳。外部系统在推文时，须利用此 ID 将 15 语言作为同一批次发布。 |

## 3. 作者与人设矩阵设计 (Author Persona Strategy)

在 Google E-E-A-T (经验、专业、权威、可信) 算法下，“Who wrote this” 和内容本身同等重要。我们不应该用“Admin”发情感指南。我们需要在 CMS (或通过 `Users` / 新建 `Authors` Collection) 预埋几位“带人设的虚拟专家”。

### 推荐挂载的人设矩阵 (Persona Presets)：
在向 API push 数据前，每篇文章必须分配一个作者 ID。以下是建议的作者矩阵：

1. **Emma Chen (关系心理学顾问层)**
   - **人设**：持证心理咨询师，专注于跨文化恋情与亲密关系建立。
   - **发文倾向**：深度干货，如 "The 3-month rule", "Conversation starters for introverts"。
   - **Tone of Voice**：温暖、专业、具备治愈感和科学依据（会引用心理学实验）。

2. **Marcus & Sarah (数字游民情侣/实战派)**
   - **人设**：环游世界的 Digital Nomads，通过 International Dating 相识。
   - **发文倾向**：约会点子、城市打卡、实战经历，如 "Best first date ideas in Tokyo", "Cheap date ideas"。
   - **Tone of Voice**：热情、口语化、充满 emoji，强调“我们当时踩过什么坑”。

3. **Dr. Alex Mercer (数据与趋势分析派)**
   - **人设**：交友产品研究员，专注于社交趋势与匹配算法解密。
   - **发文倾向**：平台玩法、个人资料优化，如 "How to set up your dating profile", "What messages get replies"。
   - **Tone of Voice**：干练、直白，喜欢用列表和统计数据说话。

*注：这些作者需要在前端有一套精致的“关于作者 (Author Bio)” 组件，且 AI 生成管线必须在 Prompt 中指明“扮演 [人设名] 的语气”。*

## 4. 规模化生成与通信架构 (Batch Pipeline & API Design)

核心业务逻辑：**解耦生成环节，只通过 Payload Local API / REST API 实现通讯写入。**

### 4.1 管道架构示意

```text
[ 外部生成控制中心 ]  -- (1) 触发词表与 Prompt -->  [ AI 多模态大模型 ]
(e.g., Python Script,              (e.g., Qwen3-VL-Flash, Claude 3.5)
 Dify Workflow)                    |
       |                           v (包含 H1/H2, Markdown, FAQ, Meta)
       |<---------- (2) 吐出结构化 JSON 数据集 ---------|
       |
       | (3) 遍历 15 语种，提取统一的 `translationGroupId`
       |
[ API 通信层 (REST / GraphQL) ]
       |
       | POST /api/articles (附带 API_KEY)
       v
[ Globol Next.js 平台 (CMS 接收端) ]
       |--> (4) 校验结构 -> (5) 插入 Articles 表 -> (6) 触发 ISR 重新生成页面
```

### 4.2 接口通信标准 (API Contract)

外部写入系统调用 Payload CMS 的自带 REST API (如 `POST /api/articles`)，发送的数据载荷应当如下：

```json
{
  "title": "15 Best Conversation Starters for Your First International Date",
  "slug": "best-international-date-conversation-starters",
  "description": "Never run out of things to say. A definitive guide for...",
  "content": { ... richText/lexical JSON 结构 ... }, 
  "author": "64a7c...", // 指向预设专家的人设 ID
  "publishedAt": "2026-03-01T12:00:00Z",
  "category": "Dating Advice",
  "faqs": [
    {
      "question": "What should I avoid asking?",
      "answer": "Avoid highly political or deeply traumatic questions..."
    }
  ],
  "language": "en",
  "translationGroupId": "batch-conv-start-001" // 所有 15 种语言此 ID 必须一致
}
```

### 4.3 痛点预警与解决策略
1. **CMS 鉴权**：系统默认 API 可能阻拦无登录的创建。需在 `payload.config.ts` 配置 API Keys，或者开设专门的 System User 给外部脚本当 Token。
2. **富文本格式化 (RichText)**：如果前端页面仍是用 `remark` 解析 Markdown 文件，或者是 Payload 的 Lexical 编辑器，外部 AI 输出的原生 Markdown 可能无法直接写入。**架构策略：** 强制外部 AI 工具生成合规的转换模块，或在接到 API 后，写一个 Endpoint 把 Markdown string 转换为 Lexical JSON 再入库。
3. **连贯的媒体引用**：文章英雄图 (`heroImage`) 在推送文字前，控制流需先调用 `POST /api/media` 传图，取回 Media ID，再塞入 Article Payload 中合并发送。

## 5. 结论
通过分离构建管线，Globol-Web 本体保持了高度内聚与极致速度；内容池则借由标准化的 REST API，向外部大算力自动化阵列敞开大门。同时，通过引入系统性的人设矩阵，网站从“一台冷冰冰的翻译机器”进化为了“一个全球顶尖交友专家云集的媒体品牌”。
