'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateCompanyStory } from '../lib/api'

export default function HomePage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError(null)

    try {
      // 跳转到公司页面，由页面处理生成
      const slug = encodeURIComponent(input.trim().toLowerCase())
      router.push(`/company/${slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-medium mb-4">
            每日5分钟读懂一家公司
          </h1>
          <p className="text-muted-foreground text-lg">
            输入公司名字或股票代码，生成深度公司故事
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="例如：Apple 或 AAPL"
              className="w-full px-6 py-4 text-lg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring content-card"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full py-4 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '生成中...' : '开始学习'}
          </button>
        </form>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>通过每日打卡，系统性学习公司知识</p>
        </div>
      </div>
    </div>
  )
}

