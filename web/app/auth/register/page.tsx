'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'
import { isEmailRateLimitError, RATE_LIMIT_MESSAGE_ZH, EMAIL_SEND_COOLDOWN_SEC } from '../../../lib/auth-rate-limit'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailCooldown, setEmailCooldown] = useState(0)

  useEffect(() => {
    if (emailCooldown <= 0) return
    const t = setInterval(() => setEmailCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000)
    return () => clearInterval(t)
  }, [emailCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (password.length < 6) {
      setMessage({ type: 'error', text: '密码至少需要 6 位' })
      return
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' })
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const redirectTo = searchParams.get('redirect') || '/'

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        setMessage({
          type: 'error',
          text: isEmailRateLimitError(error) ? RATE_LIMIT_MESSAGE_ZH : error.message,
        })
        if (isEmailRateLimitError(error)) setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
        setLoading(false)
        return
      }

      // If Supabase requires email confirmation, user might not have session
      if (data.session) {
        window.location.href = redirectTo
        return
      }

      setMessage({
        type: 'success',
        text: '注册成功。请查收邮件并点击确认链接以激活账户；确认后可使用密码登录。',
      })
      setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
    } catch (err) {
      const msg = err instanceof Error ? err.message : '注册失败，请重试'
      setMessage({
        type: 'error',
        text: isEmailRateLimitError(msg) ? RATE_LIMIT_MESSAGE_ZH : msg,
      })
      if (isEmailRateLimitError(msg)) setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md content-card rounded-lg p-8">
        <h1 className="text-2xl font-serif font-medium mb-6 text-center">注册账户</h1>

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
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              密码（至少 6 位）
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
              minLength={6}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              确认密码
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`text-sm p-3 rounded ${
                message.type === 'success'
                  ? 'bg-muted text-foreground'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || emailCooldown > 0}
            className="w-full py-2 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '注册中...' : emailCooldown > 0 ? `请 ${emailCooldown} 秒后再试` : '注册'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          已有账户？{' '}
          <Link href={`/auth/login${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`} className="underline hover:text-foreground">
            去登录
          </Link>
        </p>
      </div>
    </div>
  )
}
