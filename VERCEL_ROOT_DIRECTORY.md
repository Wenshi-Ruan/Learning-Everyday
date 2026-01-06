# ⚠️ 重要：必须在 Vercel Dashboard 设置 Root Directory

## 问题

`vercel.json` 不支持 `rootDirectory` 属性，必须在 Vercel Dashboard 中手动设置。

## 解决方案

### 在 Vercel Dashboard 设置 Root Directory（必须！）

1. **访问 Vercel Dashboard**
   - 进入你的项目：https://vercel.com/dashboard
   - 点击项目名称

2. **进入 Settings**
   - 点击顶部 "Settings" 标签
   - 在左侧菜单找到 "General"

3. **设置 Root Directory**
   - 向下滚动找到 "Root Directory"
   - 点击右侧的 "Edit" 按钮
   - **输入：`web`**
   - 点击 "Save"

4. **重新部署**
   - 回到 "Deployments" 标签
   - 点击最新部署的 "..." 菜单
   - 选择 "Redeploy"

## 为什么需要这个？

- `vercel.json` 不支持 `rootDirectory` 属性
- 必须在 Dashboard 中手动设置
- 否则 Vercel 会在根目录构建，找不到 `web/` 目录下的文件

## 验证

设置 Root Directory 为 `web` 后，重新部署应该成功。

