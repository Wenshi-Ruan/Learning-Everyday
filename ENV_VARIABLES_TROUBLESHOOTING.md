# 🔧 环境变量故障排除指南

## 问题

即使环境变量已配置，仍然出现 "Your project's URL and Key are required" 错误。

## ✅ 完整检查清单

### 步骤 1: 验证环境变量配置

在 Vercel Dashboard → Settings → Environment Variables，确认：

1. **变量名称完全匹配**（区分大小写）：
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`（不是 `NEXT_PUBLIC_SUPABASE_URL_` 或其他）
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`（不是 `NEXT_PUBLIC_SUPABASE_KEY` 或其他）

2. **变量值正确**：
   - ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://hlbszanbniewhweznuwy.supabase.co`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_yLDI2T89qW5zXUbcBYlkDA_rlm-1W-H`

3. **环境选择正确**：
   - ✅ **必须勾选 Production**（这是最重要的！）
   - ✅ Preview
   - ✅ Development

### 步骤 2: 使用调试页面检查

我已经添加了一个调试页面。部署后访问：

```
https://your-app.vercel.app/debug-env
```

这个页面会显示环境变量的实际值。如果显示 "❌ 未设置"，说明环境变量没有被正确注入。

### 步骤 3: 重新部署（关键！）

**重要：** 添加或修改环境变量后，必须重新部署才能生效！

1. **进入 Vercel Dashboard → Deployments**
2. **找到最新的部署**
3. **点击右侧 "..." 菜单**
4. **选择 "Redeploy"**
5. **在弹出对话框中：**
   - 确认选择最新的 commit
   - **重要：** 确保勾选了 "Use existing Build Cache" 旁边的选项（或者不勾选以清除缓存）
   - 点击 "Redeploy"

### 步骤 4: 检查构建日志

重新部署后，检查构建日志：

1. **进入 Deployments → 最新部署**
2. **点击 "View Build Logs"**
3. **搜索 "NEXT_PUBLIC"**，确认环境变量被读取

### 步骤 5: 清除构建缓存（如果步骤 3 不行）

如果重新部署后仍有问题：

1. **进入 Deployments**
2. **找到最新部署**
3. **点击 "..." → "Clear Build Cache"**（如果有这个选项）
4. **或者删除并重新创建部署**

## 🔍 常见问题

### Q: 环境变量已配置，但调试页面显示 "未设置"

**A:** 可能的原因：
1. 没有勾选 **Production** 环境
2. 环境变量配置后没有重新部署
3. 变量名称拼写错误

### Q: 如何确认环境变量在构建时被读取？

**A:** 在构建日志中搜索 `NEXT_PUBLIC_SUPABASE_URL`，应该能看到变量值（部分会被隐藏）。

### Q: 环境变量值中有特殊字符怎么办？

**A:** 确保值中没有多余的空格或换行符。复制粘贴时要小心。

## 🚀 快速修复步骤

1. ✅ 检查环境变量名称和值
2. ✅ 确认勾选了 **Production** 环境
3. ✅ **重新部署**（最重要！）
4. ✅ 访问 `/debug-env` 页面验证
5. ✅ 如果还有问题，清除构建缓存并重新部署

## 📝 下一步

完成以上步骤后：

1. 访问 `/debug-env` 页面
2. 告诉我调试页面显示的内容
3. 如果显示 "未设置"，检查 Vercel Dashboard 中的环境变量配置


