# 🐛 调试运行时错误

## 问题

部署成功后，访问网站时出现 "Application error: a client-side exception has occurred"。

## 可能的原因

1. **环境变量未配置**（最可能）
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Supabase 客户端初始化失败**

3. **其他客户端代码错误**

## 🔍 调试步骤

### 步骤 1: 检查浏览器控制台

1. 打开网站
2. 按 `F12` 或右键 → "检查" 打开开发者工具
3. 查看 "Console" 标签
4. **复制所有错误信息**发给我

### 步骤 2: 验证环境变量

在 Vercel Dashboard:

1. 进入项目 → Settings → Environment Variables
2. 确认以下变量已设置：
   - ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://hlbszanbniewhweznuwy.supabase.co`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_yLDI2T89qW5zXUbcBYlkDA_rlm-1W-H`
3. 确认环境变量应用于：
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 步骤 3: 重新部署

如果环境变量已设置但仍有问题：

1. 在 Vercel Dashboard → Deployments
2. 点击最新部署的 "..." → "Redeploy"
3. 这会确保环境变量被正确加载

## ✅ 已完成的修复

我已经添加了更好的错误处理，如果环境变量缺失会显示明确的错误信息。

## 📋 下一步

1. **检查浏览器控制台**，告诉我具体的错误信息
2. **验证环境变量**是否已正确配置
3. **提交修复代码**（如果需要）



