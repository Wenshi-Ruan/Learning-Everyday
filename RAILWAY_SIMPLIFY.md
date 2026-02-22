# 🔧 Railway 简化配置

## 问题

Nixpacks 在安装 Python 环境时失败，可能是配置过于复杂。

## ✅ 解决方案：简化配置

我已经删除了 `nixpacks.toml`，让 Railway 的 Railpack 自动检测 FastAPI 项目。

Railway 应该能够：
1. 自动检测到 `requirements.txt`（包含 `fastapi`）
2. 自动检测到 `main.py` 中的 `app = FastAPI(...)`
3. 自动使用 `uvicorn` 启动应用

## 📋 下一步

### 1. 提交代码

在终端执行：

```bash
cd "/Users/wenshiruan/Desktop/歹爷爷爷爷爷爷/Cursor Project/Learning Everyday"

# 如果遇到锁定
rm -f .git/index.lock

# 添加更改
git add api/

# 提交
git commit -m "Fix: Remove nixpacks.toml, let Railway auto-detect FastAPI"

# 推送
git push origin main
```

### 2. 在 Railway Dashboard 设置

1. **进入 Settings → Service**
2. **确保 Root Directory = `api`**
3. **设置 Start Command = `uvicorn main:app --host 0.0.0.0 --port $PORT`**
   - 或者留空，让 Railway 自动检测
4. **保存**

### 3. 重新部署

推送代码后，Railway 会自动触发新部署。

## 🔍 验证

Railway 应该能够：
- ✅ 自动检测 Python 项目
- ✅ 自动安装依赖（从 `requirements.txt`）
- ✅ 自动检测 FastAPI 应用
- ✅ 自动使用 uvicorn 启动

## 💡 为什么删除 nixpacks.toml？

Railway 的 Railpack 应该能够自动检测 FastAPI 项目。手动配置 `nixpacks.toml` 可能导致冲突或配置错误。让 Railway 自动检测更简单、更可靠。

## ⚠️ 如果还有问题

如果自动检测仍然失败，可以尝试：

1. **在 Railway Dashboard 手动设置**：
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Build Command: 留空（自动检测）

2. **检查文件结构**：
   - `api/main.py` - 包含 `app = FastAPI(...)` ✅
   - `api/requirements.txt` - 包含 `fastapi` 和 `uvicorn` ✅
   - `api/Procfile` - 备用启动命令 ✅


