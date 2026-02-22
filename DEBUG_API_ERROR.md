# 🐛 调试 API 错误

## 问题

网站显示"生成失败"，但 Railway 健康检查正常。

## ✅ 已完成的修复

1. ✅ 修复了 CORS 配置 - 允许所有来源
2. ✅ 改进了错误日志 - 添加了 console.log
3. ✅ 改进了错误处理 - 更好的错误信息

## 🔍 调试步骤

### 1. 检查浏览器控制台

1. **打开网站**
2. **按 F12 打开开发者工具**
3. **切换到 "Console" 标签**
4. **尝试搜索公司**
5. **查看错误信息**，告诉我：
   - 是否有红色错误？
   - 错误信息是什么？
   - 是否有 "Calling backend:" 日志？

### 2. 检查网络请求

1. **在开发者工具中切换到 "Network" 标签**
2. **尝试搜索公司**
3. **找到 `/api/generate` 请求**
4. **点击查看详情**：
   - Status Code 是什么？
   - Response 内容是什么？
   - Request URL 是什么？

### 3. 验证环境变量

在 Vercel Dashboard：

1. **Settings → Environment Variables**
2. **确认 `NEXT_PUBLIC_API_URL`**：
   - 值是否正确（应该是你的 Railway URL）
   - 是否勾选了 Production
   - 格式是否正确（应该是 `https://your-app.railway.app`，没有尾部斜杠）

### 4. 测试后端直接调用

在终端测试：

```bash
curl -X POST https://your-railway-url.railway.app/generate \
  -H "Content-Type: application/json" \
  -d '{"company_input": "Apple"}'
```

如果这个命令成功，说明后端正常。

## 📋 请提供的信息

1. **浏览器控制台的错误信息**（最重要！）
2. **Network 标签中的请求详情**
3. **Vercel 环境变量 `NEXT_PUBLIC_API_URL` 的值**（可以隐藏域名部分）
4. **直接调用后端的结果**

## 💡 可能的原因

1. **环境变量未正确设置** - 检查 Vercel 环境变量
2. **CORS 问题** - 已修复，允许所有来源
3. **API URL 格式错误** - 检查是否有尾部斜杠
4. **后端超时** - 生成内容可能需要较长时间
5. **OpenAI API Key 问题** - 检查 Railway 环境变量


