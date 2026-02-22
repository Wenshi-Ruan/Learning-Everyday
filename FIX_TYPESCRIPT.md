# 🔧 修复 TypeScript 构建错误

## 问题

Vercel 构建时找不到 `typescript` 包，即使它在 `devDependencies` 中。

## ✅ 已完成的修复

1. ✅ 简化了 `web/vercel.json`，移除了可能干扰的 `installCommand`
2. ✅ 让 Vercel 使用默认的安装行为（会自动安装 devDependencies）

## 📋 请手动提交代码

在终端执行：

```bash
cd "/Users/wenshiruan/Desktop/歹爷爷爷爷爷爷/Cursor Project/Learning Everyday"

# 如果遇到锁定
rm -f .git/index.lock

# 添加更改
git add web/vercel.json web/next.config.js

# 提交
git commit -m "Fix: Simplify vercel.json to ensure devDependencies are installed"

# 推送
git push origin main
```

## 🔍 为什么这次会成功？

1. **移除了自定义 installCommand**：让 Vercel 使用默认行为，默认会安装 devDependencies
2. **简化了 buildCommand**：只运行 `npm run build`，Vercel 会自动先运行 `npm install`
3. **Vercel 默认行为**：在生产构建时，Vercel 默认会安装所有依赖（包括 devDependencies），除非明确设置了 `NODE_ENV=production`

## 📝 如果还有问题

如果重新部署后仍有 TypeScript 错误，可以临时在 `next.config.js` 中跳过类型检查：

```javascript
typescript: {
  ignoreBuildErrors: true, // 临时跳过类型检查
},
```

但建议修复类型错误而不是跳过检查。


