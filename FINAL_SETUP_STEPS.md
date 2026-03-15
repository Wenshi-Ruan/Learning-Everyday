# 🎉 最终设置步骤

## ✅ 已完成

- ✅ 前端已部署到 Vercel
- ✅ 后端已部署到 Railway
- ✅ Supabase 已配置

## 📋 下一步：连接前端和后端

### 步骤 1: 获取 Railway 后端 URL

1. **进入 Railway Dashboard**
   - https://railway.app/dashboard
   - 找到你的项目

2. **获取 Public URL**
   - 点击项目 → Settings
   - 找到 "Public Domain" 或 "Generate Domain"
   - 点击 "Generate Domain"（如果还没有）
   - **复制 URL**（例如：`https://your-app.railway.app`）

3. **测试后端**
   ```bash
   curl https://your-app.railway.app/health
   ```
   应该返回：`{"status":"healthy"}`

### 步骤 2: 更新 Vercel 环境变量

1. **进入 Vercel Dashboard**
   - https://vercel.com/dashboard
   - 进入 `learning-everyday` 项目

2. **更新环境变量**
   - Settings → Environment Variables
   - 找到 `NEXT_PUBLIC_API_URL`
   - 点击 "Edit"
   - 更新值为你的 Railway URL（例如：`https://your-app.railway.app`）
   - 确保勾选 Production、Preview、Development
   - 点击 "Save"

### 步骤 3: 重新部署 Vercel

1. **进入 Deployments**
2. **找到最新部署**
3. **点击 "..." → "Redeploy"**
4. **等待部署完成**

### 步骤 4: 配置 Supabase Auth（如果还没做）

1. **进入 Supabase Dashboard**
   - https://supabase.com/dashboard
   - 进入你的项目

2. **配置 Redirect URL**
   - Authentication → URL Configuration
   - 在 "Redirect URLs" 中添加：
     - `https://your-vercel-app.vercel.app/auth/callback`
     - `https://*.vercel.app/auth/callback`（用于预览环境）

### 步骤 5: 测试完整流程

1. **访问网站**
   - 打开你的 Vercel URL

2. **测试功能**
   - ✅ 首页加载正常
   - ✅ 搜索公司（例如：Apple 或 AAPL）
   - ✅ 内容生成成功
   - ✅ 登录功能
   - ✅ 打卡功能
   - ✅ 历史记录

## 🔍 验证清单

- [ ] Railway 后端 URL 已获取
- [ ] Vercel 环境变量 `NEXT_PUBLIC_API_URL` 已更新
- [ ] Vercel 已重新部署
- [ ] Supabase Auth Redirect URL 已配置
- [ ] 网站可以正常访问
- [ ] 搜索公司功能正常
- [ ] 登录功能正常

## 🎊 完成！

如果所有步骤都完成了，你的应用应该可以正常工作了！

## 🐛 如果遇到问题

1. **API 调用失败**
   - 检查 `NEXT_PUBLIC_API_URL` 是否正确
   - 检查 Railway 后端是否运行正常
   - 检查浏览器控制台的错误信息

2. **登录失败**
   - 检查 Supabase Redirect URL 是否配置
   - 检查 Supabase 环境变量是否正确

3. **内容生成失败**
   - 检查 Railway 环境变量 `OPENAI_API_KEY` 是否设置
   - 检查 OpenAI API 配额是否充足



