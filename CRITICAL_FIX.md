# ⚠️ 关键修复说明

## 问题

构建时找不到 `@/lib/supabase/client`，即使文件已提交。

## 可能的原因

1. **Vercel 使用了旧的 commit**：日志显示克隆的是 `94392f6`，而不是最新的 `2e7ee31`
2. **路径别名解析问题**：webpack 配置可能需要调整

## 已完成的修复

1. ✅ 修复了 `.gitignore`，允许 `web/lib/` 目录
2. ✅ 添加了所有 `web/lib/` 文件到 Git
3. ✅ 改进了 webpack 路径别名配置

## 重要：确认 Root Directory 设置

**必须在 Vercel Dashboard 中设置 Root Directory = `web`**

1. Vercel Dashboard → 项目 → Settings → General
2. Root Directory → Edit → 输入 `web` → Save
3. **清除构建缓存并重新部署**

## 如果问题仍然存在

如果重新部署后仍有问题，可能需要：

### 方案 1: 使用相对路径（临时）

将所有 `@/lib/...` 改为相对路径，例如：
```typescript
// 从
import { createClient } from '@/lib/supabase/client'
// 改为
import { createClient } from '../../lib/supabase/client'
```

### 方案 2: 检查 Vercel 构建日志

查看完整的构建日志，确认：
- 是否使用了最新的 commit
- 文件是否被正确克隆
- Root Directory 是否正确设置

## 验证步骤

1. ✅ 确认 Root Directory = `web`
2. ✅ 清除构建缓存
3. ✅ 重新部署
4. ✅ 检查构建日志中的 commit hash 是否为最新


