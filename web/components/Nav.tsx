'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function Nav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/history', label: '历史记录', requireAuth: true },
    { href: '/checkin', label: '打卡记录', requireAuth: true },
    { href: '/profile', label: '个人中心', requireAuth: true },
  ]

  return (
    <nav className="border-b border-border/40 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-serif font-medium">
            每日5分钟
          </Link>
          
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              if (item.requireAuth && !user) return null
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    pathname === item.href
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            
            {loading ? (
              <div className="w-20 h-6 bg-muted animate-pulse rounded" />
            ) : user ? (
              <button
                onClick={handleSignOut}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                退出
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

