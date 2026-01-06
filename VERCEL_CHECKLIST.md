# Vercel 部署检查清单

## ✅ 必须完成的步骤

### 1. 在 Vercel Dashboard 设置 Root Directory

**这是最重要的！**

1. Vercel Dashboard → 你的项目
2. Settings → General
3. Root Directory → Edit
4. 输入：`web`
5. Save

### 2. 环境变量（已完成 ✅）

- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ NEXT_PUBLIC_API_URL

### 3. vercel.json（已修复 ✅）

已简化为：
```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**注意**：如果 Root Directory 设置为 `web`，路径应该是相对于 `web/` 目录的，所以不需要 `cd web &&`。

### 4. 重新部署

- Deployments → 最新部署 → ... → Redeploy

## 如果还有错误

请提供完整的错误信息，包括：
- 构建日志
- 错误消息
- 失败的具体步骤

## 常见问题

**Q: 为什么需要设置 Root Directory？**
A: 因为代码在 `web/` 目录下，Vercel 默认在根目录构建，找不到文件。

**Q: vercel.json 中的路径为什么不需要 `cd web`？**
A: 因为 Root Directory 设置为 `web` 后，Vercel 已经在 `web/` 目录下执行命令了。

