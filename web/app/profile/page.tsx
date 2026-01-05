'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
// 直接使用 Supabase 客户端
import { format, subDays } from 'date-fns'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalCheckins: 0,
    streak: 0,
    recent7Days: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login?redirect=/profile')
      return
    }

    setUser(user)
    
    try {
      const supabase = createClient()
      
      // 获取历史记录
      const { data: history } = await supabase
        .from('company_views')
        .select('id')
        .eq('user_id', user.id)
      
      // 获取打卡记录
      const { data: checkins } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
      
      // 计算 streak
      const today = new Date().toISOString().split('T')[0]
      const sortedDates = (checkins || [])
        .map(c => c.date)
        .sort((a, b) => b.localeCompare(a))
      
      let streak = 0
      let expectedDate = today
      for (const date of sortedDates) {
        if (date === expectedDate) {
          streak++
          const prevDate = new Date(expectedDate)
          prevDate.setDate(prevDate.getDate() - 1)
          expectedDate = prevDate.toISOString().split('T')[0]
        } else if (date < expectedDate) {
          break
        }
      }

      // 计算最近7天打卡数
      const sevenDaysAgo = subDays(new Date(), 7)
      const recentCheckins = (checkins || []).filter(
        (c: any) => new Date(c.date) >= sevenDaysAgo
      )

      setStats({
        totalCompanies: history?.length || 0,
        totalCheckins: checkins?.length || 0,
        streak,
        recent7Days: recentCheckins.length,
      })
    } catch (err) {
      console.error('加载统计数据失败:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="content-card rounded-lg p-8">
          <div className="h-8 bg-muted animate-pulse rounded w-1/3 mb-6" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="content-card rounded-lg p-8">
        <h1 className="text-2xl font-serif font-medium mb-8">个人中心</h1>
        
        {/* 用户信息 */}
        <div className="mb-8 pb-8 border-b border-border">
          <h2 className="text-lg font-medium mb-4">账户信息</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">邮箱：</span>
              {user?.email}
            </p>
            {user?.created_at && (
              <p>
                <span className="text-muted-foreground">注册时间：</span>
                {format(new Date(user.created_at), 'yyyy-MM-dd')}
              </p>
            )}
          </div>
        </div>

        {/* 学习统计 */}
        <div>
          <h2 className="text-lg font-medium mb-6">学习统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">累计学习</p>
              <p className="text-2xl font-serif font-medium">{stats.totalCompanies}</p>
              <p className="text-xs text-muted-foreground mt-1">家公司</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">累计打卡</p>
              <p className="text-2xl font-serif font-medium">{stats.totalCheckins}</p>
              <p className="text-xs text-muted-foreground mt-1">天</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">连续打卡</p>
              <p className="text-2xl font-serif font-medium">{stats.streak}</p>
              <p className="text-xs text-muted-foreground mt-1">天</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">最近7天</p>
              <p className="text-2xl font-serif font-medium">{stats.recent7Days}</p>
              <p className="text-xs text-muted-foreground mt-1">次打卡</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

