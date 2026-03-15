import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const redirectTo = requestUrl.searchParams.get('redirect') || '/'

  console.log('Auth callback received:', { code: code ? 'present' : 'missing', error, errorDescription })

  // 处理错误情况
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    const errorMsg = errorDescription || error || 'Authentication failed'
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorMsg)}`, requestUrl.origin)
    )
  }

  if (!code) {
    console.error('No code parameter in callback URL')
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_code', requestUrl.origin)
    )
  }

  try {
    const supabase = await createClient()
    
    // 交换 code 获取 session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Exchange code error:', exchangeError)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }

    if (!data.session) {
      console.error('No session after code exchange')
      return NextResponse.redirect(
        new URL('/auth/login?error=session_creation_failed', requestUrl.origin)
      )
    }

    console.log('Auth successful, redirecting to:', redirectTo)

    // 成功，重定向到目标页面
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  } catch (err) {
    console.error('Unexpected error in callback:', err)
    const errorMsg = err instanceof Error ? err.message : '登录失败，请重试'
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorMsg)}`, requestUrl.origin)
    )
  }
}

