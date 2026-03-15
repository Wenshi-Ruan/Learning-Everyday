# 🔍 如何找到你的 Vercel 域名

## 方法 1: 在 Vercel Dashboard 查看（最简单）

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com/dashboard
   - 登录你的账户

2. **找到你的项目**
   - 在项目列表中，找到 `learning-everyday` 或类似名称的项目
   - 点击进入项目

3. **查看域名**
   - 在项目页面顶部，你会看到项目的 URL
   - 格式通常是：`https://learning-everyday-xxxxx.vercel.app`
   - 或者：`https://learning-everyday.vercel.app`（如果你设置了自定义域名）

4. **复制完整域名**
   - 这就是你的 Vercel 域名！
   - 例如：`https://learning-everyday-abc123.vercel.app`

## 方法 2: 在部署历史中查看

1. **进入项目页面**
2. **点击 "Deployments" 标签**
3. **找到最新的部署**
4. **点击部署卡片**
5. **在部署详情页面，你会看到 "Domains" 部分**
   - 这里会显示所有可用的域名

## 方法 3: 在项目设置中查看

1. **进入项目页面**
2. **点击 "Settings" 标签**
3. **在左侧菜单找到 "Domains"**
4. **这里会显示所有配置的域名**

## 📋 找到域名后

一旦你找到了你的 Vercel 域名（例如：`https://learning-everyday-abc123.vercel.app`），你需要：

### 1. 在 Supabase 配置 Site URL

1. 进入 **Supabase Dashboard** → 你的项目
2. **Settings** → **API**
3. 找到 **Site URL** 字段
4. 设置为你的 Vercel 域名（例如：`https://learning-everyday-abc123.vercel.app`）
5. 保存

### 2. 在 Supabase 配置 Redirect URLs

1. 进入 **Authentication** → **URL Configuration**
2. 在 **Redirect URLs** 中添加：

```
https://learning-everyday-abc123.vercel.app/auth/callback
https://*.vercel.app/auth/callback
https://*.vercel.sh/auth/callback
```

**重要**：将 `learning-everyday-abc123` 替换为你的实际域名部分！

## 💡 提示

- Vercel 会自动为每个项目生成一个域名
- 格式通常是：`https://[项目名]-[随机字符].vercel.app`
- 如果你有多个部署环境，每个环境可能有不同的域名
- 生产环境的域名通常在项目主页顶部显示

## 🚨 如果找不到

如果你在 Vercel Dashboard 中找不到项目：

1. **检查是否已部署**
   - 如果没有部署，需要先部署项目
   - 参考 `VERCEL_SETUP_STEPS.md` 进行部署

2. **检查账户**
   - 确保你登录的是正确的 Vercel 账户
   - 检查是否有多个账户

3. **检查项目名称**
   - 项目名称可能与 GitHub 仓库名称不同
   - 在 Vercel Dashboard 中搜索你的 GitHub 仓库名称


