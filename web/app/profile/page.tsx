'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'
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
  const [passwordSection, setPasswordSection] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [displayNameSaving, setDisplayNameSaving] = useState(false)
  const [displayNameMessage, setDisplayNameMessage] = useState<string | null>(null)

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
    setDisplayName((user as any).user_metadata?.full_name ?? '')

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

  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setDisplayNameSaving(true)
    setDisplayNameMessage(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName.trim() || undefined },
      })
      if (error) {
        setDisplayNameMessage(error.message)
        setDisplayNameSaving(false)
        return
      }
      setUser((u: any) => (u ? { ...u, user_metadata: { ...u.user_metadata, full_name: displayName.trim() } } : u))
      setDisplayNameMessage('已保存')
    } catch (err) {
      setDisplayNameMessage(err instanceof Error ? err.message : '保存失败')
    } finally {
      setDisplayNameSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: '密码至少需要 6 位' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: '两次输入的密码不一致' })
      return
    }
    setPasswordLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setPasswordMessage({ type: 'error', text: error.message })
        setPasswordLoading(false)
        return
      }
      setPasswordMessage({ type: 'success', text: '密码已更新' })
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSection(false)
    } catch (err) {
      setPasswordMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '更新失败，请重试',
      })
    } finally {
      setPasswordLoading(false)
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
          <form onSubmit={handleSaveDisplayName} className="mt-4 flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-1">显示名称（用于导航栏显示）</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={user?.email ?? ''}
                className="w-48 px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={displayNameSaving}
              />
            </div>
            <button
              type="submit"
              disabled={displayNameSaving}
              className="py-2 px-4 bg-foreground text-background rounded font-medium text-sm hover:opacity-90 disabled:opacity-50"
            >
              {displayNameSaving ? '保存中...' : '保存'}
            </button>
            {displayNameMessage && (
              <span className={`text-sm ${displayNameMessage === '已保存' ? 'text-foreground' : 'text-destructive'}`}>
                {displayNameMessage}
              </span>
            )}
          </form>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/history"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              浏览历史（已读故事）
            </Link>
            <button
              type="button"
              onClick={() => setPasswordSection(!passwordSection)}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              {passwordSection ? '取消修改密码' : '修改密码'}
            </button>
          </div>
          {passwordSection && (
            <form onSubmit={handleChangePassword} className="mt-4 p-4 border border-border rounded-lg space-y-3 max-w-sm">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">新密码（至少 6 位）</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                  minLength={6}
                  disabled={passwordLoading}
                />
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-1">确认新密码</label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                  minLength={6}
                  disabled={passwordLoading}
                />
              </div>
              {passwordMessage && (
                <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-destructive' : 'text-foreground'}`}>
                  {passwordMessage.text}
                </p>
              )}
              <button
                type="submit"
                disabled={passwordLoading}
                className="py-2 px-4 bg-foreground text-background rounded font-medium text-sm hover:opacity-90 disabled:opacity-50"
              >
                {passwordLoading ? '更新中...' : '更新密码'}
              </button>
            </form>
          )}
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

