# 🔧 修复环境变量配置

## 问题

错误信息：`Your project's URL and Key are required to create a Supabase client!`

这说明 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 在 Vercel 中没有正确配置。

## ✅ 解决步骤

### 步骤 1: 在 Vercel Dashboard 配置环境变量

1. **访问 Vercel Dashboard**
   - https://vercel.com/dashboard
   - 进入 `learning-everyday` 项目

2. **进入环境变量设置**
   - 点击顶部 "Settings" 标签
   - 左侧菜单找到 "Environment Variables"

3. **添加环境变量**

   点击 "Add New" 按钮，添加以下变量：

   **变量 1:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://hlbszanbniewhweznuwy.supabase.co`
   - **Environment:** 勾选所有三个：
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

   **变量 2:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `sb_publishable_yLDI2T89qW5zXUbcBYlkDA_rlm-1W-H`
   - **Environment:** 勾选所有三个：
     - ✅ Production
     - ✅ Preview
     - ✅ Development

   **变量 3 (可选):**
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `http://localhost:8000` (或你的 FastAPI 后端 URL)
   - **Environment:** 勾选所有三个

4. **保存**
   - 每个变量添加后点击 "Save"
   - 确保所有变量都已保存

### 步骤 2: 重新部署

**重要：** 添加环境变量后，必须重新部署才能生效！

1. **进入 Deployments 标签**
2. **找到最新的部署**
3. **点击右侧 "..." 菜单**
4. **选择 "Redeploy"**
5. **在弹出对话框中：**
   - 确认选择最新的 commit
   - 点击 "Redeploy"

### 步骤 3: 验证

部署完成后：

1. **等待部署完成**（通常 1-2 分钟）
2. **访问网站**
3. **检查是否还有错误**
4. **如果还有问题，检查浏览器控制台**

## ⚠️ 重要提示

- 环境变量名称必须**完全匹配**（包括大小写）
- 确保勾选了 **Production** 环境
- 添加环境变量后**必须重新部署**
- 环境变量值不要有多余的空格

## 🔍 验证环境变量

部署后，如果还有问题，可以：

1. 在 Vercel Dashboard → Deployments → 最新部署
2. 查看构建日志，确认环境变量被加载
3. 或者在代码中临时添加 `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)` 来验证



