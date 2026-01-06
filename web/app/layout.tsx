import type { Metadata } from 'next'
import './globals.css'
import { getCurrentBackgroundImage } from '@/constants/theme'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: '每日5分钟读懂一家公司',
  description: '通过每日打卡，系统性学习公司知识',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bgImage = getCurrentBackgroundImage()
  
  return (
    <html lang="zh-CN">
      <body 
        style={{
          '--bg-image': `url('${bgImage}')`,
        } as React.CSSProperties}
      >
        <div className="min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

