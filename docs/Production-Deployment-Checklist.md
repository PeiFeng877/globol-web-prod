# 生产环境部署清单 (Production Deployment Checklist)
[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md

本文档用于记录 Globol 项目所有线上云端资源的配置状态。**在您下一次准备让 Vercel 正式发布页面并连接真数据库时，请务必严格按照此清单执行！**（我已经收到了提示要求，会在后续你打算部署时主动提醒你）

## 1. 核心云端数据库 (Supabase)
目前我们已成功在云端部署了生产环境专用的 PostgreSQL 数据库。
- **服务商**: Supabase
- **Region 机房**: US East (N. Virginia) `us-east-1`
- **当前状态**: 空库，但**已利用本机的代码网络成功连通跑完了 Payload Migration 建表脚本**。云端库的表结构已和本地开发环境最新的重构架构 100% 对齐。
- **Connection String (连接钥匙) 获取方式**:
  1. 登录 Supabase 后台 -> 左侧齿轮 `Project Settings` -> `Database`。
  2. 找到 Connection String 区域，选择 `URI` 选项卡。
  3. **必须将 Method 切换为 `Session Pooler`** (解决本地网络访问云端 IPv4 兼容性报错)。
  4. 复制那串绿色链接（自带 `pooler.supabase.com` 和端口 `6543` ），并将内部的 `[YOUR-PASSWORD]` 手动替换为您的真实强密码。

## 2. 前端托管与算力引擎 (Vercel)
Vercel 承载着 Next.js 的页面路由、SSR 渲染以及 Payload CMS 的后台交互接口。
- **服务商**: Vercel (Hobby Plan)
- **Region 机房**: Washington, D.C., USA (`iad1`) -> **此物理位置与 Supabase 完美组成了内网，数据库延迟极低 (< 5ms)。**
- **当前状态**: 页面代码已部署，但**尚未配置生产数据库密码**，目前正式服相当于还没通底库的数据血脉。

### 🚨 下一次 Vercel 部署前必须履行的操作 🚨
在您处理完目前认为有问题的本地文章，并决定将这个新版本真正推活之前，**必须在 Vercel 补齐以下配置：**

1. 准备好刚刚利用 Supabase 拼凑好的那串带有真实密码的 `Session Pooler` 数据库连接串。
2. 登录 Vercel Dashboard，进入 `globol-website` 项目。
3. 导航至 `Settings` -> `Environment Variables`。
4. 新增一条核心变量：
   - **Key**: `DATABASE_URI`
   - **Value**: `[您配置好真实密码的 Supabase 网址]`
5. 顺手核对一下，确保在 Vercel 同样配置了以下几个必须与本地 `.env.local` 齐平的变量：
   - `PAYLOAD_SECRET` (可以自己随便脸滚键盘写一串复杂的字符串，作为用户登录后的加密盐)
   - `BLOB_READ_WRITE_TOKEN` (保证在正式服也可以上传文章配图的 Vercel Blob 读写 Token)
   - `NEXT_PUBLIC_FIREBASE_*` 等一系列谷歌统计变量。
6. 点击 Save 妥善保存变量配置。
7. 回到 Vercel 顶部的 `Deployments` 页面，找到右上角或列表最新记录旁边的那三个点 `...`，选择 **`Redeploy`** 进行完整的代码重构。

**此步完成后，打开 `https://www.globol.im/admin` 即可在公网尽情书写多语言内容！**
