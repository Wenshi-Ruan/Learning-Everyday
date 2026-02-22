# 🔧 Railway 手动设置启动命令

## 问题

Railway 的 Railpack 无法自动检测启动命令，即使有 `nixpacks.toml` 和 `Procfile`。

## ✅ 解决方案：在 Railway Dashboard 手动设置

### 方法 1: 在 Railway Dashboard 设置（推荐）

1. **进入 Railway Dashboard**
   - https://railway.app/dashboard
   - 找到你的项目

2. **进入项目设置**
   - 点击项目名称
   - 点击 "Settings" 标签

3. **设置启动命令**
   - 找到 "Start Command" 或 "Deploy" 部分
   - 在 "Start Command" 输入框中输入：
     ```
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - 点击 "Save" 或 "Update"

4. **重新部署**
   - 回到 "Deployments" 标签
   - 点击 "Redeploy" 或等待自动部署

### 方法 2: 使用 Railway CLI

如果你安装了 Railway CLI：

```bash
# 登录
railway login

# 进入项目目录
cd api

# 设置启动命令
railway variables set START_COMMAND="uvicorn main:app --host 0.0.0.0 --port $PORT"

# 部署
railway up
```

### 方法 3: 确保文件结构正确

Railway 可能无法检测 FastAPI，因为：
- `app` 变量必须在 `main.py` 的顶层定义 ✅（已确认）
- `requirements.txt` 必须包含 `fastapi` 和 `uvicorn` ✅（已确认）

## 📋 检查清单

在 Railway Dashboard 中确认：

- [ ] Root Directory 设置为 `api`（如果从 monorepo 部署）
- [ ] Start Command 设置为：`uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] 环境变量 `OPENAI_API_KEY` 已设置
- [ ] `PORT` 变量会自动设置（不需要手动设置）

## 🔍 验证

部署成功后：

1. **检查部署日志**
   - 应该看到：`Uvicorn running on http://0.0.0.0:PORT`

2. **测试健康检查**
   ```bash
   curl https://your-app.railway.app/health
   ```
   应该返回：`{"status":"healthy"}`

3. **测试根路径**
   ```bash
   curl https://your-app.railway.app/
   ```
   应该返回：`{"message":"Company Story Generator API","status":"running"}`

## 💡 为什么需要手动设置？

Railway 的 Railpack 应该能自动检测 FastAPI，但有时：
- 文件结构复杂（monorepo）
- 配置文件格式问题
- Railpack 版本问题

手动设置启动命令是最可靠的方法。


