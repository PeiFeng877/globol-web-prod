# 内容管理流转指南 (Content Workflow Guidelines)
[PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md

针对当前最新重构的多语言 Payload CMS 架构，本指南解释了底层存储与核心发布流程的机制。

## 1. 存储与部署机制：Vercel Blob 优势
### 存储顾虑解答
您提到的核心顾虑是：“文章增多会导致原本存放于项目内的图片使工程体积膨胀，进而在 Vercel 部署时引发容量和构建性能问题。”

目前的架构中，我们使用了 `@payloadcms/storage-vercel-blob` 插件拦截了 `Media` 集合的上传过程。这意味着**通过 Payload 后台上传/引用的所有图片资源（乃至文章正文配图），都不会驻留在项目仓库或 `public/` 目录中**。

上传时，它们会直接被推送到云端 Vercel Blob 对象储存仓库；下发时，它们会带有一个全局公网 CDN 链接（例如 `https://*.public.blob.vercel-storage.com/...`）。
- **无状态部署**：应用代码（GitHub Commit）与用户上传的媒体资源彻底解耦。不论新增一万篇文章还是十万张图片，项目的容器体积始终保持不变。
- **性能优势**：静态文件直接交由最近的 Vercel Edge CDN 节点分发，不消耗 Web 服务的流量与算力。

## 2. 核心发布流转：一键翻译落库与拉取 
目前的 Payload 数据被拆分为「单语言实体对应一条记录」的模式。我们只需在新建和更新时利用 `translationGroupId` 作为联系纽带即可。以下是确切的工作流模型：

### (a) 新增一篇文章的流程
1. **源语言创作**：首先在后台 `Articles` 里点击 *Create New*，正常编写您最擅长的母语内容（例如选定 `language: zh`）。
2. **分配统一标签**：为它取一个在各个语言下**恒定不变**的 `translationGroupId`（例如：`cute-date-ideas-guide`），点击发布。
3. **一键翻译脚本（系统侧工作流）**：
   未来开发好翻译插件/脚本当用户触发“一键同步至其他14种语言”时。系统底层会：
    - 读取 `language=zh` 以及 `translationGroupId=cute-date-ideas-guide` 的这篇原文记录。
    - 将它的标题、副标题、内容送入 LLM Gateway 进行 AI 翻译。
    - 在循环里调用 `payload.create()` **分批生成 14 篇全新的 Articles**。这些生成的记录各自带有正确的 `language` 标签，并**全部绑定同样的 `translationGroupId`**。

### (b) 更新某篇文章内容的同步流程
当过了一段时间，您需要修改上述的源语言文章的内容时：
1. **更新源文件**：进入 Payload CMS `Articles` 列表，使用 Filter 过滤出你要找的文章并进入对其进行重新编辑和保存。
2. **触发同步更新（系统侧工作流）**：
   - 触发一键同步后，系统会直接根据这篇文章身上的 `translationGroupId=cute-date-ideas-guide` 去数据库 `find()` 该 ID 下属的所有 14 个其他语言版本的子集。
   - 然后再次调用翻译 AI 接口比较前后差异或全量直翻，并顺着查到的实体 ID 执行 `payload.update({ id: targetId, data: { content: newContent } })` 进行覆写。

### 这个架构的核心精神
通过这种将物理记录分开（从而使得前端不需要做复杂的语言折叠查询），但又在底层通过一根名为 `translationGroupId` 的隐形锁链串起来的“分合”架构，你获得了：**完美的后台数据透明度**（能直接看出哪些语言没翻译）+ **丝滑的一键全端自动更新能力**。
