'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { generateCompanyStory, parseArticleSections } from '../../../lib/api'
import { createClient } from '../../../lib/supabase/client'
import { getTranslations, type Language } from '../../../lib/i18n'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function CompanyPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = decodeURIComponent(params.slug as string)
  
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [article, setArticle] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string>(slug)
  const [ticker, setTicker] = useState<string | null>(null)
  const [sections, setSections] = useState<Array<{ title: string; content: string }>>([])
  const [user, setUser] = useState<any>(null)
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
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

  useEffect(() => {
    loadContent()
    checkAuth()
  }, [slug, language]) // 添加 language 依赖

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data } = await supabase
        .from('checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()
      
      setCheckedIn(!!data)
    }
  }

  const loadContent = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // 先尝试从缓存读取（扩展到90天，允许用户重新阅读历史文章）
      const normalized = slug.toUpperCase()
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90) // 90天 = 约1个季度
      
      const { data: cached, error: cacheError } = await supabase
        .from('company_content_cache')
        .select('*')
        .eq('ticker', normalized)
        .gte('generated_at', ninetyDaysAgo.toISOString())
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle() // 使用 maybeSingle() 而不是 single()，避免 406 错误
      
      // 如果查询出错，记录但不阻止继续
      if (cacheError && cacheError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.warn('Cache query error:', cacheError)
      }
      
      if (cached) {
        // 检查是否超过90天
        const generatedDate = new Date(cached.generated_at)
        const daysSinceGeneration = Math.floor((Date.now() - generatedDate.getTime()) / (1000 * 60 * 60 * 24))
        const isStale = daysSinceGeneration > 90
        
        setArticle(cached.content_text)
        setCompanyName(cached.company_name)
        setTicker(cached.ticker)
        setSections(parseArticleSections(cached.content_text))
        setLoading(false)
        
        // 如果内容超过90天，显示提示
        if (isStale) {
          setError('此内容已超过90天，建议重新生成以获取最新数据。点击"重试"按钮重新生成。')
        }
        
        // 记录浏览
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('company_views').insert({
            user_id: user.id,
            ticker: cached.ticker,
            company_name: cached.company_name,
            content_cache_id: cached.id,
          })
        }
        return
      }

      // 生成新内容
      setGenerating(true)
      const response = await generateCompanyStory({
        company_input: slug,
        use_cache: true,
        enable_web_search: false,
        language: language, // 传递语言参数
      })

      setArticle(response.article)
      setCompanyName(response.company_name)
      setTicker(response.ticker)
      setSections(parseArticleSections(response.article))

      // 缓存内容
      const { data: cacheData } = await supabase
        .from('company_content_cache')
        .insert({
          ticker: response.ticker,
          company_name: response.company_name,
          content_json: response.factpack,
          content_text: response.article,
        })
        .select('id')
        .single()

      // 记录浏览
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('company_views').insert({
          user_id: user.id,
          ticker: response.ticker,
          company_name: response.company_name,
          content_cache_id: cacheData?.id,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
      setGenerating(false)
    }
  }

  const handleCheckin = async () => {
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    setCheckingIn(true)
    try {
      const supabase = createClient()
      const today = format(new Date(), 'yyyy-MM-dd')
      
      // 检查是否已打卡
      const { data: existing } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()
      
      if (existing) {
        setCheckedIn(true)
        return
      }
      
      // 创建打卡记录
      await supabase.from('checkins').insert({
        user_id: user.id,
        date: today,
        ticker,
        company_name: companyName,
      })
      
      setCheckedIn(true)
    } catch (err) {
      alert('打卡失败，请重试')
    } finally {
      setCheckingIn(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="content-card rounded-lg p-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !article) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="content-card rounded-lg p-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={loadContent}
            className="px-4 py-2 bg-foreground text-background rounded hover:opacity-90"
          >
            {t.company.retry}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 头部信息 */}
      <div className="content-card rounded-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-serif font-medium mb-2">{companyName}</h1>
            {ticker && (
              <p className="text-muted-foreground text-sm">股票代码: {ticker}</p>
            )}
            <p className="text-muted-foreground text-sm mt-2">预计阅读时间: 5 分钟</p>
          </div>
          
          <button
            onClick={handleCheckin}
            disabled={checkedIn || checkingIn}
            className={`px-6 py-2 rounded-lg font-medium transition-opacity ${
              checkedIn
                ? 'bg-muted text-muted-foreground cursor-default'
                : 'bg-foreground text-background hover:opacity-90'
            }`}
          >
            {checkingIn ? t.company.checkinLoading : checkedIn ? t.company.checkedIn : t.company.checkin}
          </button>
        </div>
      </div>

      {/* 文章内容 */}
      <div className="content-card rounded-lg p-8">
        {generating && (
          <div className="mb-6 p-4 bg-muted/50 rounded text-sm text-muted-foreground">
            {t.company.generating}
          </div>
        )}
        
        {error && article && (
          <div className="mb-6 p-4 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded text-sm">
            {error}
            <button
              onClick={() => {
                setError(null)
                loadContent()
              }}
              className="ml-4 px-4 py-2 bg-foreground text-background rounded hover:opacity-90 text-sm"
            >
              {t.company.retry}
            </button>
          </div>
        )}
        
        {sections.length > 0 ? (
          <div className="prose prose-lg max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h2 className="text-2xl font-serif font-medium mb-4">{section.title}</h2>
                <div className="text-foreground/90 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {section.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

