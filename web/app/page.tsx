'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { generateCompanyStory } from '../lib/api'
import { getTranslations, type Language } from '../lib/i18n'

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>('zh')

  // 从 URL 参数或 localStorage 获取语言设置
  useEffect(() => {
    const langFromUrl = searchParams.get('lang') as Language
    const langFromStorage = localStorage.getItem('language') as Language
    const lang = langFromUrl || langFromStorage || 'zh'
    setLanguage(lang)
    if (lang !== langFromStorage) {
      localStorage.setItem('language', lang)
    }
  }, [searchParams])

  const t = getTranslations(language)

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    // 更新 URL 参数
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('lang', lang)
    window.history.replaceState({}, '', newUrl.toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError(null)

    try {
      // 跳转到公司页面，由页面处理生成
      const slug = encodeURIComponent(input.trim().toLowerCase())
      router.push(`/company/${slug}?lang=${language}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-2xl">
        {/* 语言选择器 */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-2 border border-border rounded-lg p-1">
            <button
              onClick={() => handleLanguageChange('zh')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                language === 'zh'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                language === 'en'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-medium mb-4">
            {t.home.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t.home.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.home.placeholder}
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
            {loading ? t.home.buttonLoading : t.home.button}
          </button>
        </form>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>{t.home.footer}</p>
        </div>
      </div>
    </div>
  )
}

