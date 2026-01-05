'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface CompanyView {
  id?: string
  user_id: string
  ticker: string | null
  company_name: string
  viewed_at: string
  content_cache_id?: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<CompanyView[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login?redirect=/history')
      return
    }

    setUser(user)
    
    try {
      const { data, error } = await supabase
        .from('company_views')
        .select('*')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(50)
      
      if (error) throw error
      setHistory(data || [])
    } catch (err) {
      console.error('加载历史记录失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (item: CompanyView) => {
    const slug = encodeURIComponent((item.ticker || item.company_name).toLowerCase())
    router.push(`/company/${slug}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="content-card rounded-lg p-8">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="content-card rounded-lg p-8">
        <h1 className="text-2xl font-serif font-medium mb-6">浏览历史</h1>
        
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>还没有浏览记录</p>
            <p className="text-sm mt-2">开始学习第一家公司吧</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.company_name}</p>
                    {item.ticker && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.ticker}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(item.viewed_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

