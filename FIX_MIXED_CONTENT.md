# 🔧 修复 Mixed Content 和 Supabase 406 错误

## 问题

1. **Mixed Content 错误**：Railway URL 使用了 HTTP 而不是 HTTPS
2. **Supabase 406 错误**：查询缓存时返回 406

## ✅ 已完成的修复

1. ✅ 修复了 API URL - 自动将 HTTP 转换为 HTTPS
2. ✅ 修复了 Supabase 查询 - 使用 `maybeSingle()` 而不是 `single()`

## 📋 下一步

### 1. 在 Vercel 更新环境变量（重要！）

1. **进入 Vercel Dashboard**
   - Settings → Environment Variables
   - 找到 `NEXT_PUBLIC_API_URL`
   - **确保 URL 使用 HTTPS**（例如：`https://your-app.railway.app`）
   - 如果当前是 HTTP，改为 HTTPS
   - 保存

### 2. 提交代码

在终端执行：

```bash
cd "/Users/wenshiruan/Desktop/歹爷爷爷爷爷爷/Cursor Project/Learning Everyday"

# 如果遇到锁定
rm -f .git/index.lock

# 添加更改
git add web/app/api/generate/route.ts web/app/company/[slug]/page.tsx

# 提交
git commit -m "Fix: Force HTTPS for API URL and fix Supabase query"

# 推送
git push origin main
```

### 3. 重新部署

- **Vercel**: 推送代码后会自动重新部署，或者手动 Redeploy
- **Railway**: 不需要重新部署（只是前端代码更改）

## 🔍 验证

部署后：

1. **清除浏览器缓存**（重要！）
   - 按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)

2. **测试搜索**
   - 尝试搜索公司（例如：Apple）
   - 检查浏览器控制台是否还有错误
   - 检查 Network 标签中的请求是否使用 HTTPS

## 💡 为什么会出现这些问题？

1. **Mixed Content**：
   - HTTPS 网站不能加载 HTTP 资源
   - Railway 可能提供了 HTTP URL，需要手动改为 HTTPS

2. **Supabase 406**：
   - `single()` 在没有结果时会返回 406
   - `maybeSingle()` 在没有结果时返回 null，不会报错

## ⚠️ 重要提示

**确保 Vercel 环境变量中的 `NEXT_PUBLIC_API_URL` 使用 HTTPS！**

格式应该是：`https://your-app.railway.app`（没有尾部斜杠）


