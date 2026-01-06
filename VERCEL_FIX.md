# Vercel 构建错误修复指南

## 问题分析

错误显示：`Module not found: Can't resolve '@/lib/supabase/client'`

这是因为 Vercel 在**根目录**构建，但代码在 `web/` 目录。

## 解决方案

### 方法 1: 在 Vercel Dashboard 设置 Root Directory（推荐）

1. **访问 Vercel Dashboard**
   - 进入你的项目：https://vercel.com/dashboard
   - 点击项目名称

2. **进入项目设置**
   - 点击 "Settings" 标签
   - 在左侧菜单找到 "General"

3. **设置 Root Directory**
   - 找到 "Root Directory" 选项
   - 点击 "Edit"
   - 输入：`web`
   - 点击 "Save"

4. **重新部署**
   - 回到 "Deployments" 标签
   - 点击最新的部署右侧的 "..." 菜单
   - 选择 "Redeploy"

### 方法 2: 使用 vercel.json（已创建）

我已经在根目录创建了 `vercel.json`，但 Vercel 可能优先使用 Dashboard 设置。

**确保以下内容**：
- 根目录的 `vercel.json` 已存在（已创建 ✅）
- 在 Vercel Dashboard 中也设置 Root Directory 为 `web`

## 验证修复

重新部署后，构建应该成功。如果还有错误，检查：

1. **环境变量是否正确设置**：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL`

2. **文件结构**：
   ```
   web/
   ├── app/
   ├── lib/
   │   └── supabase/
   │       ├── client.ts
   │       └── server.ts
   ├── package.json
   └── tsconfig.json
   ```

## 如果还有问题

如果设置 Root Directory 后仍有问题，可能需要：

1. **删除并重新导入项目**
2. **或者**在项目根目录创建符号链接（不推荐）

## 快速操作步骤

1. Vercel Dashboard → 项目 → Settings → General
2. Root Directory → Edit → 输入 `web` → Save
3. Deployments → 最新部署 → ... → Redeploy

