# 快速部署到 Vercel

## 已配置的 Supabase

- ✅ URL: https://hlbszanbniewhweznuwy.supabase.co
- ✅ Anon Key: sb_publishable_yLDI2T89qW5zXUbcBYlkDA_rlm-1W-H
- ✅ Schema 已创建

## 一键部署到 Vercel

### 方法1: 使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 进入 web 目录
cd web

# 4. 部署
vercel

# 5. 设置环境变量（交互式）
# 会提示输入环境变量，输入：
# NEXT_PUBLIC_SUPABASE_URL = https://hlbszanbniewhweznuwy.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_yLDI2T89qW5zXUbcBYlkDA_rlm-1W-H
# NEXT_PUBLIC_API_URL = http://localhost:8000 (或你的后端地址)

# 6. 生产环境部署
vercel --prod
```

### 方法2: 通过 GitHub + Vercel Web UI

1. **推送代码到 GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **在 Vercel 部署**:
   - 访问 https://vercel.com/new
   - 导入 GitHub 仓库
   - **重要**: 设置 "Root Directory" 为 `web`
   - 在 "Environment Variables" 中添加：
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://hlbszanbniewhweznuwy.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yLDI2T89qW5zXUbcBYlkDA_rlm-1W-H
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```
   - 点击 "Deploy"

3. **配置 Supabase Auth**:
   - 在 Supabase Dashboard → Authentication → URL Configuration
   - 添加 Redirect URL: `https://your-app.vercel.app/auth/callback`

## 本地测试（可选）

如果想先本地测试：

```bash
# 1. 安装依赖
cd web
npm install

# 2. 创建 .env.local（已包含 Supabase 配置）
# 注意：.env.local 在 .gitignore 中，不会提交

# 3. 启动开发服务器
npm run dev

# 4. 在另一个终端启动后端
cd ../api
python main.py
```

## 后端 API 部署（可选）

如果后端也需要部署：

### Railway 部署

1. 访问 https://railway.app
2. 创建新项目，从 GitHub 导入
3. 设置 Root Directory: `api`
4. 环境变量：
   - `OPENAI_API_KEY` = 你的 OpenAI Key
   - `OPENAI_MODEL` = `gpt-4o`
   - `PORT` = `8000`
5. 部署后，更新前端的 `NEXT_PUBLIC_API_URL`

## 验证

部署完成后访问你的 Vercel URL，测试：
- ✅ 首页可以访问
- ✅ 可以输入公司名（如 "Apple"）
- ✅ 可以生成内容
- ✅ 可以登录（Magic Link）
- ✅ 打卡功能正常

## 注意事项

1. **Supabase Auth Redirect URL**: 必须在 Supabase Dashboard 中配置你的 Vercel 域名
2. **后端 API**: 如果后端未部署，前端会显示 API 错误，但不影响浏览和登录功能
3. **环境变量**: 确保在 Vercel Dashboard 中正确配置所有环境变量

