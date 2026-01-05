'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const redirectTo = searchParams.get('redirect') || '/'
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) throw error

      setMessage('请检查您的邮箱，点击邮件中的链接完成登录')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md content-card rounded-lg p-8">
        <h1 className="text-2xl font-serif font-medium mb-6 text-center">登录</h1>
        
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

          {message && (
            <div className={`text-sm p-3 rounded ${
              message.includes('检查') 
                ? 'bg-muted text-foreground' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '发送中...' : '发送登录链接'}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          我们将向您的邮箱发送一个登录链接，点击即可完成登录
        </p>
      </div>
    </div>
  )
}

