# Vercel 设置步骤（必须完成）

## ✅ 环境变量已配置（很好！）

从截图看，你的环境变量已经正确设置：
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  
- ✅ NEXT_PUBLIC_API_URL

## ⚠️ 关键步骤：设置 Root Directory

**这是最重要的！** 如果不设置，Vercel 会在根目录构建，找不到 `web/` 目录下的文件。

### 详细步骤：

1. **在 Vercel Dashboard 中**：
   - 进入你的项目页面
   - 点击顶部 "Settings" 标签

2. **找到 "General" 设置**：
   - 在左侧菜单找到 "General"
   - 向下滚动找到 "Root Directory" 选项

3. **设置 Root Directory**：
   - 点击 "Root Directory" 右侧的 "Edit" 按钮
   - 在输入框中输入：`web`
   - 点击 "Save"

4. **重新部署**：
   - 回到 "Deployments" 标签
   - 找到最新的部署（失败的）
   - 点击右侧的 "..." 三个点
   - 选择 "Redeploy"

## 为什么需要这个设置？

- 你的代码在 `web/` 目录下
- Vercel 默认在项目根目录构建
- 如果不设置 Root Directory，Vercel 找不到 `package.json` 和代码文件
- 设置后，Vercel 会在 `web/` 目录下构建

## 验证

设置 Root Directory 并重新部署后：
- ✅ 构建应该成功
- ✅ 不再出现 "Module not found" 错误
- ✅ 应用可以正常访问

## 如果设置后还有问题

请提供新的错误信息，我会继续帮你修复。


