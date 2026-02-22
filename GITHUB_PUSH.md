# 推送到 GitHub 的步骤

## ✅ 已完成

- [x] Git 仓库已初始化
- [x] 文件已添加到暂存区
- [x] 初始提交已创建

## 📤 推送到 GitHub

### 步骤 1: 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `company-learning` (或你喜欢的名字)
   - Description: `每日5分钟读懂一家公司 - Web App`
   - 选择 **Public** 或 **Private**
   - **不要** 勾选 "Initialize with README"（我们已经有了）
3. 点击 "Create repository"

### 步骤 2: 连接本地仓库到 GitHub

复制 GitHub 提供的命令，或者使用以下命令（替换 `YOUR_USERNAME` 和 `YOUR_REPO_NAME`）：

```bash
cd "/Users/wenshiruan/Desktop/歹爷爷爷爷爷爷/Cursor Project/Learning Everyday"

# 添加远程仓库（替换为你的 GitHub 仓库 URL）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 或者使用 SSH（如果你配置了 SSH key）
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 3: 验证推送

访问你的 GitHub 仓库页面，确认所有文件都已上传。

## 🚀 接下来：在 Vercel 部署

推送完成后，按照以下步骤在 Vercel 部署：

1. **访问 Vercel**: https://vercel.com/new
2. **导入 GitHub 仓库**:
   - 点击 "Import Git Repository"
   - 选择你刚创建的仓库
3. **配置项目**:
   - **Root Directory**: 设置为 `web` ⚠️ **重要！**
   - Framework Preset: Next.js（会自动检测）
4. **环境变量**:
   在 "Environment Variables" 中添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://hlbszanbniewhweznuwy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yLDI2T89qW5zXUbcBYlkDA_rlm-1W-H
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
5. **部署**: 点击 "Deploy"

## ⚙️ 配置 Supabase Auth

部署完成后，在 Supabase Dashboard 配置：

1. 访问 Supabase Dashboard
2. Authentication → URL Configuration
3. 在 "Redirect URLs" 中添加：
   ```
   https://your-app.vercel.app/auth/callback
   ```
   （替换 `your-app` 为你的 Vercel 域名）

## ✅ 完成！

部署完成后，访问你的 Vercel URL 即可使用应用。



