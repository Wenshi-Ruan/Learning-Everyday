/**
 * Next.js API Route: 代理调用 FastAPI 后端
 * 
 * 注意：需要部署 FastAPI 后端并设置 NEXT_PUBLIC_API_URL 环境变量
 * 如果后端未部署，这个路由会返回错误
 */
import { NextRequest, NextResponse } from 'next/server'

// 从环境变量获取 API URL，如果没有设置则使用默认值
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 检查 API URL 是否配置
    if (!API_URL || API_URL.includes('localhost')) {
      console.error('API_URL not configured:', API_URL)
      return NextResponse.json(
        { 
          error: 'FastAPI 后端未配置。请设置 NEXT_PUBLIC_API_URL 环境变量。',
          detail: `Current API_URL: ${API_URL || 'not set'}`
        },
        { status: 503 }
      )
    }
    
    console.log('Calling backend:', `${API_URL}/generate`)
    
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // 设置超时
      signal: AbortSignal.timeout(300000), // 5 分钟超时
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { detail: errorText || '生成失败' }
      }
      console.error('Backend error:', response.status, errorData)
      return NextResponse.json(
        { error: errorData.detail || errorData.error || '生成失败' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // 处理网络错误
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('fetch')) {
        return NextResponse.json(
          { error: '无法连接到后端服务。请检查 NEXT_PUBLIC_API_URL 环境变量是否正确。' },
          { status: 503 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

