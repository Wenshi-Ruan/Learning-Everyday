'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { generateCompanyStory, parseArticleSections } from '../../../lib/api'
import { createClient } from '../../../lib/supabase/client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function CompanyPage() {
  const params = useParams()
  const router = useRouter()
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

  useEffect(() => {
    loadContent()
    checkAuth()
  }, [slug])

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
      
      // 先尝试从缓存读取
      const normalized = slug.toUpperCase()
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      
      const { data: cached } = await supabase
        .from('company_content_cache')
        .select('*')
        .eq('ticker', normalized)
        .gte('generated_at', oneDayAgo.toISOString())
        .order('generated_at', { ascending: false })
        .limit(1)
        .single()
      
      if (cached) {
        setArticle(cached.content_text)
        setCompanyName(cached.company_name)
        setTicker(cached.ticker)
        setSections(parseArticleSections(cached.content_text))
        setLoading(false)
        
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="content-card rounded-lg p-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={loadContent}
            className="px-4 py-2 bg-foreground text-background rounded hover:opacity-90"
          >
            重试
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
            {checkingIn ? '打卡中...' : checkedIn ? '今日已打卡 ✅' : '今日打卡'}
          </button>
        </div>
      </div>

      {/* 文章内容 */}
      <div className="content-card rounded-lg p-8">
        {generating && (
          <div className="mb-6 p-4 bg-muted/50 rounded text-sm text-muted-foreground">
            正在生成内容，请稍候...
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

