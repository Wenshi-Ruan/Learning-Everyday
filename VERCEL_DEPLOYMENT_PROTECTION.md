# Fix: 登录后仍显示「登录」、邮箱链接点开后出现 Vercel 验证页

## 原因说明

如果你看到的流程是：

1. 点击「登录」→ 输入邮箱 → 收到 Supabase 邮件  
2. 点邮件里的链接后，出现 **「通过 Vercel 登录」** 的页面，要求再次输入邮箱、输入邮件里的验证码  
3. 验证通过后回到首页，但导航栏仍然显示「登录」而不是你的账户名  

说明 **Vercel 的「部署保护 / Deployment Protection」** 打开了。  
魔法链接会跳转到你站点上的 `https://你的域名/auth/callback?code=xxx`，但这一请求被 Vercel 拦截，先显示 Vercel 的验证页。  
等你在 Vercel 页面里验证完，再进到你网站时，**原来的 `?code=xxx` 已经没了**，我们的应用拿不到这个 code，就无法完成 Supabase 登录，所以你会一直处于「未登录」状态。

## 解决办法（必须做）

**关闭 Vercel 的部署保护**，让魔法链接的请求直接到达你的应用，这样 `auth/callback` 才能收到 `code` 并完成登录。

### 操作步骤

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard)，进入你的项目（Learning Everyday）。
2. 顶部点 **Settings**。
3. 左侧找到 **Deployment Protection**（或 **Security** → **Deployment Protection**）。
4. 将 **Vercel Authentication** / **Deployment Protection** 设为：
   - **Off**（推荐：生产环境完全关闭），或  
   - **Only Preview Deployments**（仅预览部署需要验证，生产不验证）。
5. 保存。

这样，用户点击邮件里的登录链接时，会直接打开  
`https://你的域名/auth/callback?code=xxx`，  
请求会直接到你的 Next.js 应用，完成 Supabase 登录并跳转到首页，导航栏就会显示你的账户名和「退出」。

## 如何确认已生效

1. 退出登录（若当前已登录）。
2. 在登录页选择「邮箱链接」，输入邮箱，发送链接。
3. 到邮箱里点击链接。  
   - **正确**：浏览器直接打开你的站点（可能先到 `/auth/callback` 再跳首页），且导航栏显示你的邮箱/名称和「退出」。  
   - **错误**：先出现 Vercel 的「Verify」/「Log in」页面，要你再输入邮箱和验证码。

若仍先出现 Vercel 验证页，请再检查：

- 当前访问的是 **生产域名**（例如 `xxx.vercel.app` 或你自己的域名），且该域名对应的 Vercel 项目里 Deployment Protection 已按上面关闭或仅限预览。
- 没有在团队/账号级别开启额外的「Vercel Authentication」或保护策略。

## 代码侧已做的处理

- **服务端**：`/auth/callback` 会用 URL 里的 `code` 换 Supabase 的 session 并写入 cookie，然后重定向到首页。
- **客户端**：若 Supabase 用「hash」方式跳转（部分情况），会由 `AuthUrlHandler` 在浏览器里处理并清理 URL，保证登录状态能正确显示。

只要 Vercel 不再拦截 `auth/callback` 的请求，登录后就会正常显示账户名和「退出」。
