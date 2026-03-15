# 🔧 Railway pip 命令修复

## 问题

构建日志显示：`/bin/bash: line 1: pip: command not found`

这说明 Nixpacks 构建时找不到 `pip` 命令。

## ✅ 已完成的修复

1. ✅ 更新了 `nixpacks.toml`：
   - 添加了 `pip` 到 `nixPkgs`
   - 将 `pip install` 改为 `python -m pip install`

## 📋 下一步

### 1. 提交代码

在终端执行：

```bash
cd "/Users/wenshiruan/Desktop/歹爷爷爷爷爷爷/Cursor Project/Learning Everyday"

# 如果遇到锁定
rm -f .git/index.lock

# 添加更改
git add api/nixpacks.toml

# 提交
git commit -m "Fix: Use python -m pip instead of pip in nixpacks.toml"

# 推送
git push origin main
```

### 2. 在 Railway 重新部署

推送代码后，Railway 会自动触发新部署。或者：

1. **进入 Railway Dashboard**
2. **找到你的项目**
3. **点击 "Redeploy"**
4. **查看新的构建日志**

## 🔍 验证

新的构建日志应该显示：
- ✅ `python -m pip install -r requirements.txt` 成功执行
- ✅ 依赖安装成功
- ✅ 应用启动成功

## 💡 为什么使用 `python -m pip`？

在某些 Python 环境中，`pip` 命令可能不在 PATH 中，但 `python -m pip` 总是可用，因为：
- 它使用当前 Python 解释器的 pip 模块
- 不依赖于 PATH 中的 pip 可执行文件
- 更可靠，特别是在容器环境中



