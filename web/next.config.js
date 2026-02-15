const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 注意：环境变量会自动从 process.env 读取，不需要在 config 中声明
  // 在 Vercel Dashboard 中设置环境变量即可
  // Webpack 配置：确保路径别名正确解析
  // 当 Root Directory 设置为 'web' 时，process.cwd() 就是 web/ 目录
  webpack: (config) => {
    const rootDir = process.cwd()
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': rootDir,
    }
    // 调试信息（生产环境不会显示）
    if (process.env.NODE_ENV === 'development') {
      console.log('Webpack alias @ resolved to:', rootDir)
    }
    return config
  },
}

module.exports = nextConfig
