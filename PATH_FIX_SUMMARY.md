# 路径解析问题修复总结

## 问题

构建时找不到 `@/lib/supabase/client` 和 `@/lib/supabase/server`

## 已完成的修复

1. ✅ **添加了 webpack 路径别名配置**
   - 在 `next.config.js` 中添加了 webpack 配置
   - 确保 `@` 别名正确解析到当前目录

2. ✅ **文件确认存在**
   - `web/lib/supabase/client.ts` ✅
   - `web/lib/supabase/server.ts` ✅

3. ✅ **tsconfig.json 配置正确**
   - `"@/*": ["./*"]` ✅

## 关键配置

### next.config.js
```javascript
webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': require('path').resolve(__dirname),
  }
  return config
}
```

### tsconfig.json
```json
"paths": {
  "@/*": ["./*"]
}
```

## 如果还有问题

如果重新部署后仍有路径解析错误，可能需要：

1. **确认 Root Directory 设置**：
   - Vercel Dashboard → Settings → General
   - Root Directory = `web` ✅

2. **检查构建日志**：
   - 查看完整的错误堆栈
   - 确认文件是否在正确位置

3. **尝试相对路径**（临时测试）：
   如果路径别名仍有问题，可以临时改为相对路径：
   ```typescript
   // 从
   import { createClient } from '@/lib/supabase/client'
   // 改为
   import { createClient } from '../../lib/supabase/client'
   ```
   （但这不是推荐方案，路径别名应该能工作）

## 下一步

重新部署后，webpack 配置应该能正确解析路径别名。如果还有问题，请提供新的错误信息。


