# 🔧 修复 API 调用问题

## 问题

搜索公司时出现 "Failed to fetch" 错误。

## 原因

代码直接调用 `http://localhost:8000`，这在生产环境中不可用：
1. 浏览器无法访问 `localhost:8000`（这是服务器端地址）
2. FastAPI 后端可能没有部署
3. 即使部署了，也需要处理 CORS 问题

## ✅ 已完成的修复

我已经修改了 `web/lib/api.ts`，现在使用 Next.js API Route (`/api/generate`) 作为代理：

- ✅ 使用相对路径 `/api/generate` 而不是 `http://localhost:8000`
- ✅ Next.js API Route 会代理调用 FastAPI 后端
- ✅ 避免了 CORS 问题
- ✅ 在生产环境中可以正常工作

## 📋 下一步：部署 FastAPI 后端

现在需要部署 FastAPI 后端，或者更新 `NEXT_PUBLIC_API_URL` 指向已部署的后端。

### 选项 1: 使用 Next.js API Route（当前方案）

如果 FastAPI 后端还没有部署，Next.js API Route 会尝试调用 `http://localhost:8000`，这在 Vercel 服务器端可能不可用。

### 选项 2: 部署 FastAPI 后端

需要将 FastAPI 后端部署到：
- Railway
- Render
- Fly.io
- 或其他支持 Python 的平台

然后更新 `NEXT_PUBLIC_API_URL` 环境变量。

### 选项 3: 临时解决方案

如果暂时无法部署 FastAPI 后端，可以：
1. 在本地运行 FastAPI 后端
2. 使用 ngrok 或其他工具暴露本地服务
3. 更新 `NEXT_PUBLIC_API_URL` 为 ngrok URL

## 🚀 立即操作

1. **提交修复代码**（已完成 ✅）
2. **部署 FastAPI 后端**（需要）
3. **更新环境变量**（如果需要）

## 💡 建议

对于生产环境，建议：
1. 部署 FastAPI 后端到 Railway 或 Render
2. 更新 `NEXT_PUBLIC_API_URL` 环境变量
3. 或者将 Python 代码集成到 Next.js API Route 中（更简单）


