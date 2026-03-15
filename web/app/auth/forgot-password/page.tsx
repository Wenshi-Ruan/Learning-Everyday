'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'
import { isEmailRateLimitError, RATE_LIMIT_MESSAGE_ZH, EMAIL_SEND_COOLDOWN_SEC } from '../../../lib/auth-rate-limit'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
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
    if (!email.trim() || emailCooldown > 0) return

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/auth/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
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

      setMessage({
        type: 'success',
        text: '已发送重置链接到您的邮箱，请查收并点击链接设置新密码。',
      })
      setEmailCooldown(EMAIL_SEND_COOLDOWN_SEC)
    } catch (err) {
      const msg = err instanceof Error ? err.message : '发送失败，请重试'
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
        <h1 className="text-2xl font-serif font-medium mb-6 text-center">找回密码</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              注册邮箱
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
            {loading ? '发送中...' : emailCooldown > 0 ? `请 ${emailCooldown} 秒后再试` : '发送重置链接'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          <Link href="/auth/login" className="underline hover:text-foreground">
            返回登录
          </Link>
        </p>
      </div>
    </div>
  )
}
