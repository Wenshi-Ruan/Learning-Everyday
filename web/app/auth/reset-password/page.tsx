'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

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
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setMessage({ type: 'error', text: error.message })
        setLoading(false)
        return
      }

      setMessage({ type: 'success', text: '密码已更新，正在跳转...' })
      setTimeout(() => {
        router.push('/profile')
        router.refresh()
      }, 1500)
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '更新失败，请重试',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md content-card rounded-lg p-8 text-center">
          <p className="text-muted-foreground">正在验证链接...</p>
          <p className="text-sm text-muted-foreground mt-2">
            请从邮件中的链接进入本页，或{' '}
            <Link href="/auth/forgot-password" className="underline">重新申请重置</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md content-card rounded-lg p-8">
        <h1 className="text-2xl font-serif font-medium mb-6 text-center">设置新密码</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              新密码（至少 6 位）
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
              确认新密码
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
            disabled={loading}
            className="w-full py-2 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '更新中...' : '更新密码'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          <Link href="/profile" className="underline hover:text-foreground">
            返回个人中心
          </Link>
        </p>
      </div>
    </div>
  )
}
