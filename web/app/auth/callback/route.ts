import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const redirectTo = requestUrl.searchParams.get('redirect') || '/'

  // 处理错误情况
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_code', requestUrl.origin)
    )
  }

  try {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Exchange code error:', exchangeError)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }

    // 成功，重定向到目标页面
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  } catch (err) {
    console.error('Unexpected error in callback:', err)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('登录失败，请重试')}`, requestUrl.origin)
    )
  }
}

