'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'
import { isEmailRateLimitError, RATE_LIMIT_MESSAGE_ZH, EMAIL_SEND_COOLDOWN_SEC } from '../../../lib/auth-rate-limit'

type LoginMode = 'password' | 'magic'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<LoginMode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [emailCooldown, setEmailCooldown] = useState(0)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) setMessage(decodeURIComponent(error))
  }, [searchParams])

  useEffect(() => {
    if (emailCooldown <= 0) return
    const t = setInterval(() => setEmailCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000)
    return () => clearInterval(t)
  }, [emailCooldown])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const redirectTo = searchParams.get('redirect') || '/'

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setMessage(isEmailRateLimitError(error) ? RATE_LIMIT_MESSAGE_ZH : error.message)
        if (isEmailRateLimitError(error)) setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
        setLoading(false)
        return
      }

      if (data.session) {
        window.location.href = redirectTo
        return
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '登录失败，请重试'
      setMessage(isEmailRateLimitError(msg) ? RATE_LIMIT_MESSAGE_ZH : msg)
      if (isEmailRateLimitError(msg)) setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || emailCooldown > 0) return

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const redirectTo = searchParams.get('redirect') || '/'
      const origin = window.location.origin
      const callbackUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: callbackUrl,
          shouldCreateUser: true,
        },
      })

      if (error) {
        setMessage(isEmailRateLimitError(error) ? RATE_LIMIT_MESSAGE_ZH : error.message)
        if (isEmailRateLimitError(error)) setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
        setLoading(false)
        return
      }
      setMessage('请检查您的邮箱，点击邮件中的链接完成登录。若点开链接后出现 Vercel 验证页（要求再输入邮箱和验证码），请在 Vercel 项目设置中关闭 Deployment Protection。')
      setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
    } catch (err) {
      const msg = err instanceof Error ? err.message : '登录失败，请重试'
      setMessage(isEmailRateLimitError(msg) ? RATE_LIMIT_MESSAGE_ZH : msg)
      if (isEmailRateLimitError(msg)) setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = mode === 'password' ? handlePasswordLogin : handleMagicLink

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md content-card rounded-lg p-8">
        <h1 className="text-2xl font-serif font-medium mb-6 text-center">登录</h1>

        <div className="flex border-b border-border mb-6">
          <button
            type="button"
            onClick={() => { setMode('password'); setMessage(null) }}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'password'
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            密码登录
          </button>
          <button
            type="button"
            onClick={() => { setMode('magic'); setMessage(null) }}
            className={`flex-1 py-2 text-sm font-medium ${
              mode === 'magic'
                ? 'text-foreground border-b-2 border-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            邮箱链接
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              邮箱地址
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
              disabled={loading}
            />
          </div>

          {mode === 'password' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required={mode === 'password'}
                disabled={loading}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                <Link href="/auth/forgot-password" className="underline hover:text-foreground">
                  忘记密码？
                </Link>
              </p>
            </div>
          )}

          {message && (
            <div
              className={`text-sm p-3 rounded ${
                message.includes('检查') ? 'bg-muted text-foreground' : 'bg-destructive/10 text-destructive'
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (mode === 'magic' ? emailCooldown > 0 : false)}
            className="w-full py-2 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading
              ? mode === 'password'
                ? '登录中...'
                : '发送中...'
              : mode === 'magic' && emailCooldown > 0
                ? `请 ${emailCooldown} 秒后再试`
                : mode === 'password'
                  ? '登录'
                  : '发送登录链接'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          还没有账户？{' '}
          <Link
            href={`/auth/register${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}
            className="underline hover:text-foreground"
          >
            注册
          </Link>
        </p>
      </div>
    </div>
  )
}
