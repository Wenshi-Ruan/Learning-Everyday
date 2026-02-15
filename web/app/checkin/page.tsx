'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
interface Checkin {
  id?: string
  user_id: string
  date: string
  ticker?: string | null
  company_name?: string | null
  created_at?: string
}
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function CheckinPage() {
  const router = useRouter()
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [streak, setStreak] = useState(0)
  const [calendar, setCalendar] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login?redirect=/checkin')
      return
    }

    setUser(user)
    
    try {
      // 获取打卡记录
      const { data: checkinsData, error: checkinsError } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(100)
      
      if (checkinsError) throw checkinsError
      setCheckins((checkinsData || []) as Checkin[])
      
      // 计算 streak
      const today = new Date().toISOString().split('T')[0]
      const sortedDates = (checkinsData || [])
        .map((c: any) => c.date)
        .sort((a: string, b: string) => b.localeCompare(a))
      
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
      setStreak(streak)
      
      // 生成日历数据
      const calendarData: Record<string, boolean> = {}
      checkinsData?.forEach((checkin: any) => {
        calendarData[checkin.date] = true
      })
      setCalendar(calendarData)
    } catch (err) {
      console.error('加载打卡数据失败:', err)
    } finally {
      setLoading(false)
    }
  }

  // 生成最近30天的日历
  const generateCalendar = () => {
    const today = new Date()
    const start = subDays(today, 29)
    const days = eachDayOfInterval({ start, end: today })
    
    return days.map(day => ({
      date: day,
      checked: calendar[format(day, 'yyyy-MM-dd')] || false,
    }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="content-card rounded-lg p-8">
          <div className="h-8 bg-muted animate-pulse rounded w-1/3 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const calendarDays = generateCalendar()

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="content-card rounded-lg p-6">
          <h2 className="text-sm text-muted-foreground mb-2">连续打卡</h2>
          <p className="text-3xl font-serif font-medium">{streak} 天</p>
        </div>
        <div className="content-card rounded-lg p-6">
          <h2 className="text-sm text-muted-foreground mb-2">累计打卡</h2>
          <p className="text-3xl font-serif font-medium">{checkins.length} 天</p>
        </div>
      </div>

      {/* 日历 */}
      <div className="content-card rounded-lg p-8 mb-8">
        <h2 className="text-xl font-serif font-medium mb-6">最近30天</h2>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center rounded text-xs ${
                day.checked
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground'
              }`}
              title={format(day.date, 'yyyy-MM-dd')}
            >
              {format(day.date, 'd')}
            </div>
          ))}
        </div>
      </div>

      {/* 打卡记录列表 */}
      <div className="content-card rounded-lg p-8">
        <h2 className="text-xl font-serif font-medium mb-6">打卡记录</h2>
        
        {checkins.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>还没有打卡记录</p>
            <p className="text-sm mt-2">开始学习并打卡吧</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkins.map((checkin) => (
              <div
                key={checkin.id || checkin.date}
                className="p-4 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {format(new Date(checkin.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                    </p>
                    {checkin.company_name && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {checkin.company_name}
                        {checkin.ticker && ` (${checkin.ticker})`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

