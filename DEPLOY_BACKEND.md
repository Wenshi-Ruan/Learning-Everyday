# 🚀 部署 FastAPI 后端

## 当前状态

✅ 前端已部署到 Vercel
❌ FastAPI 后端需要部署

## 问题

Next.js API Route 需要调用 FastAPI 后端，但后端还没有部署。需要将 `api/` 目录中的 FastAPI 应用部署到云服务。

## 部署选项

### 选项 1: Railway（推荐，简单）

1. **访问 Railway**: https://railway.app
2. **创建新项目** → "Deploy from GitHub repo"
3. **选择仓库**: `Wenshi-Ruan/Learning-Everyday`
4. **配置**:
   - Root Directory: `api`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **环境变量**:
   - `OPENAI_API_KEY`: 你的 OpenAI API Key
6. **获取 URL**: Railway 会提供一个 URL，例如 `https://your-app.railway.app`
7. **更新 Vercel 环境变量**:
   - `NEXT_PUBLIC_API_URL` = `https://your-app.railway.app`

### 选项 2: Render

1. **访问 Render**: https://render.com
2. **创建新 Web Service** → "Connect GitHub"
3. **配置**:
   - Name: `learning-everyday-api`
   - Environment: Python 3
   - Root Directory: `api`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **环境变量**:
   - `OPENAI_API_KEY`: 你的 OpenAI API Key
5. **获取 URL**: Render 会提供一个 URL
6. **更新 Vercel 环境变量**

### 选项 3: Fly.io

1. **安装 Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **在 `api/` 目录创建 `fly.toml`**:
   ```toml
   app = "learning-everyday-api"
   primary_region = "iad"
   
   [build]
   
   [env]
     PORT = "8080"
   
   [[services]]
     internal_port = 8080
     protocol = "tcp"
   ```
3. **部署**: `fly deploy`
4. **设置环境变量**: `fly secrets set OPENAI_API_KEY=your-key`
5. **获取 URL**: `fly info`

## 📋 部署后步骤

1. **获取后端 URL**（例如：`https://your-app.railway.app`）

2. **在 Vercel Dashboard 更新环境变量**:
   - 进入项目 → Settings → Environment Variables
   - 更新 `NEXT_PUBLIC_API_URL` = `https://your-app.railway.app`
   - 确保勾选 Production、Preview、Development

3. **重新部署 Vercel**:
   - Deployments → 最新部署 → "..." → "Redeploy"

4. **测试**:
   - 访问网站
   - 搜索一个公司
   - 应该能正常生成内容

## ⚠️ 注意事项

- **OpenAI API Key**: 确保在部署平台设置了 `OPENAI_API_KEY` 环境变量
- **CORS**: FastAPI 后端已配置 CORS，允许 Vercel 域名访问
- **超时**: 生成内容可能需要较长时间，确保部署平台支持长请求

## 🔍 验证

部署后，可以测试后端：

```bash
curl -X POST https://your-backend-url/generate \
  -H "Content-Type: application/json" \
  -d '{"company_input": "Apple"}'
```

如果返回 JSON 数据，说明后端部署成功。



