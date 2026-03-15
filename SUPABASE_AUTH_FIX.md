# 🔧 Supabase 登录修复指南

## 问题

点击邮箱中的登录链接时，Safari 显示"无法连接到服务器"。

## 可能的原因

1. **Supabase Site URL 配置不正确**
2. **Redirect URLs 未正确配置**
3. **URL 格式问题（HTTP vs HTTPS）**

## ✅ 已完成的代码修复

1. ✅ 改进了错误处理和日志记录
2. ✅ 确保使用正确的 URL 格式
3. ✅ 添加了 `shouldCreateUser: true` 选项

## 📋 必须完成的 Supabase 配置

### 步骤 1: 检查 Supabase Site URL

1. 进入 **Supabase Dashboard** → 你的项目
2. 进入 **Settings** → **API**
3. 找到 **Site URL** 字段
4. **确保设置为你的 Vercel 域名**（例如：`https://your-app.vercel.app`）
5. 保存

### 步骤 2: 配置 Redirect URLs

1. 进入 **Supabase Dashboard** → 你的项目
2. 进入 **Authentication** → **URL Configuration**
3. 在 **Redirect URLs** 中添加以下 URL（每行一个）：

```
https://your-vercel-app.vercel.app/auth/callback
https://your-vercel-app.vercel.app/auth/reset-password
https://*.vercel.app/auth/callback
https://*.vercel.app/auth/reset-password
https://*.vercel.sh/auth/callback
https://*.vercel.sh/auth/reset-password
```

**重要**：
- 将 `your-vercel-app` 替换为你的实际 Vercel 域名
- 确保使用 HTTPS（不是 HTTP）
- 确保 URL 以 `/auth/callback` 结尾（没有尾部斜杠）

### 步骤 3: 检查 Email Templates（可选）

1. 进入 **Authentication** → **Email Templates**
2. 检查 **Magic Link** 模板
3. 确保模板中的 URL 格式正确

## 🔍 验证步骤

1. **清除浏览器缓存**
2. **重新发送登录邮件**
3. **点击邮件中的链接**
4. **检查浏览器控制台**（F12）是否有错误信息

## 🐛 调试

如果仍然有问题，检查：

1. **Vercel 日志**：
   - 进入 Vercel Dashboard → 你的项目 → **Deployments** → 最新部署 → **Functions** → `/auth/callback`
   - 查看是否有错误日志

2. **Supabase 日志**：
   - 进入 Supabase Dashboard → **Logs** → **Auth Logs**
   - 查看认证请求的详细信息

3. **浏览器控制台**：
   - 按 F12 打开开发者工具
   - 查看 Console 和 Network 标签
   - 检查是否有错误信息

## 💡 常见问题

### Q: 邮件中的链接指向哪里？

A: Supabase 发送的邮件中的链接格式通常是：
```
https://your-project.supabase.co/auth/v1/verify?token=xxx&type=magiclink&redirect_to=https://your-app.vercel.app/auth/callback
```

如果这个链接无法打开，可能是：
- Supabase 项目 URL 不正确
- 网络连接问题
- Supabase 服务暂时不可用

### Q: 如何测试本地环境？

A: 对于本地开发，需要：
1. 在 Supabase Dashboard 中添加 `http://localhost:3000/auth/callback` 到 Redirect URLs
2. 确保 Site URL 设置为 `http://localhost:3000`（仅用于开发）

## 📝 检查清单

- [ ] Supabase Site URL 设置为你的 Vercel 域名
- [ ] Redirect URLs 包含你的 Vercel 域名 + `/auth/callback`
- [ ] 所有 URL 使用 HTTPS（生产环境）
- [ ] 代码已部署到 Vercel
- [ ] 环境变量已正确设置

## 🚀 部署代码

修复代码后，需要重新部署：

```bash
cd "/Users/wenshiruan/Desktop/歹爷爷爷爷爷爷/Cursor Project/Learning Everyday"
git add web/app/auth/login/page.tsx web/app/auth/callback/route.ts
git commit -m "Fix: Improve Supabase auth error handling and logging"
git push origin main
```

Vercel 会自动重新部署。


