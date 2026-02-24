# 09 - 自动化内容生成工具：数据库与存储连接指南及流程审计

[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

## 1. 服务连接凭证指南

基于当前项目配置（`.env.local` 与 `.env.production`），外部生成脚本的连接配置如下：

### (a) 本地数据库 (Local Database)
- **环境**: 本地 PostgreSQL
- **连接字符串 (URI)**: `postgresql://postgres:postgres@localhost:5432/postgres`
- **使用建议**: 本地起开发服务器后，建议**不要**使用 `pg` 库直连数据库通过 SQL 强插数据，而是通过调用本地 Payload CMS 的 REST API：`POST http://localhost:3000/api/articles` 写入。

### (b) 云端对象存储 (Vercel Blob)
- **Token**: `vercel_blob_rw_KuStXF4WqVl39Dlp_zCtFTdQEC5JyG3Zap3rnYuT4Wf0BXU`
- **前缀策略**: 根据 `src/payload.config.ts`，本地上传的图片会自动加上 `dev/` 前缀，生产环境会自动加上 `prod/` 前缀。
- **上传方式**: 请勿直接调用 Vercel Blob SDK 上传，应该调用 Payload CMS 的接口 `POST /api/media` （需附带文件数据），Payload 会自动将文件存入 Blob 并返回包含持久化 URL 的 Media 对象。随后拿这个返回的 ID 填入 Article 的 `heroImage` 字段。

### (c) 云端数据库 (Supabase Production Database)
- **环境**: Supabase 生产库
- **连接字符串 (URI)**: `postgresql://postgres.qudqpgzshpqmucwvkhho:rCI3H2gyo0SS6fAe@aws-1-us-east-1.pooler.supabase.com:6543/postgres`
  *(注意：你的 `.env.production` 文件中此 URI 结尾包含一个多余的换行符 `\n`，请在脚本中使用时进行 `.trim()` 处理)*

---

## 2. 自动化流程逻辑审计与风险评估

你预期的流程：`生成文 -> 本地预览 -> 翻译 -> 本地预览 -> 注入正式服`。
该流程整体非常稳健（沙盒验证策略很好），但如果处理不当，存在以下**核心技术风险与修正建议**：

### 风险 1：直连数据库插入数据 (Bypass CMS API Risk)
**缺陷**：如果你的 Python/Node 脚本使用 `pg` 库直接执行 SQL `INSERT INTO articles`，将导致 Payload CMS 的生命周期钩子无法触发（如：多语言自动生成关联映射、Next.js Webhook ISR 缓存刷新等）。
**修正策略**：**任何数据流转都必须走 Payload REST API**，而不是数据库原生查询。
- 注入图片：`POST [host]/api/media`
- 注入文章：`POST [host]/api/articles`

### 风险 2：Dev与Prod前缀导致的文件与ID分裂 
**缺陷**：本地测试时，调用本地 API 使得图片上传到 Vercel Blob 时带有 `dev/` 前缀。如果最后一步“注入正式服”只是把本地沙盒的数据库表直接“Copy 数据”到正式库，由于正式库没经过标准的 `POST`，文章里引用的图片 ID 或链接仍然是指向带 `dev/` 的测试资源或出现 ID 映射找不到的错误。
**修正策略**：“注入正式服”这一步，必须让自动化工具**重新向正式服的 Payload API（如 `https://globol-web.com/api/articles`）发起一次完整的 API 推送**，重新传图并生成数据。

### 风险 3：关联实体 (Author / Category) 的 ID 不一致
**缺陷**：在本地库中，作者（如 Emma Chen）的 ID 可能是 `UUID-A`，但在 Supabase 正式库中这个作者的 ID 可能是 `UUID-B`。强行同步数据会导致外键关联报错。
**修正策略**：脚本在组合 Payload JSON 前，应先通过 `GET /api/users?where[name][equals]=Emma` 动态查询拿到对应环境的作者 ID，再去组装数据。

### 风险 4：API 接口鉴权拦截 (Authorization)
**缺陷**：Payload 的 `/api/articles` 等修改性接口默认是开启了 `auth: true` 校验的。
**修正策略**：在脚本最初，需先发一个 `POST /api/users/login` 请求（输入你的超管邮箱和密码）拿到返回的 Token，后续所有请求均在请求头加上 `Authorization: JWT {token}`。

---

## 3. 标准化脚本工作流示例

正确安全的自动化脚本流应该如下进行重构：

**第一阶段：创作与本地验证**
1. **生成数据**：调用 AI 生成主语言文章 JSON。
2. **本地 API 入库**：
   - 使用本地管理员账号 `POST http://localhost:3000/api/users/login` 获取 Token。
   - 脚本发送图片到 `POST http://localhost:3000/api/media`，拿到 `local_media_id`。
   - 脚本动态获取分类与人设的 local ID。
   - 携带正文、`local_media_id`、预设的同一个 `translationGroupId` 等信息调用 `POST http://localhost:3000/api/articles`。
3. **本地第一轮校验**：打开 `localhost:3000` 检查文章效果。

**第二阶段：多语言扩展与验证**
4. **多语言延展**：调用翻译服务，**务必使用相同的** `translationGroupId`，重复以上本地 API 写入流程，注入 14 个小语言版本。
5. **本地第二轮校验**：确认各个 `/zh`, `/es`, `/kr` 等路径能否正确关联、样式是否溢出。

**第三阶段：生产推流（关键解耦点！）**
6. **面向生产环境的纯净重推**：
   - 脚本更换 Endpoint 到你的正式域名（如 `https://globol.com`）。
   - 登录生产环境拿生产 Token。
   - **重新上传原图**到 `POST https://globol.com/api/media` 触发含 `prod/` 前缀的正式存储，拿 `prod_media_id`。
   - **重新获取**线上生产库对应的人设和分类 ID。
   - 最后，带着以上所有的生产级 ID（含多语种列表），调用一次生产级 `POST /api/articles`，实现无缝干净的上线。
