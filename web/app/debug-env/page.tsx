'use client'

export default function DebugEnvPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="content-card rounded-lg p-8">
        <h1 className="text-2xl font-serif font-medium mb-6">环境变量调试</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-medium mb-2">NEXT_PUBLIC_SUPABASE_URL:</h2>
            <code className="block p-2 bg-muted rounded">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ 未设置'}
            </code>
          </div>
          
          <div>
            <h2 className="font-medium mb-2">NEXT_PUBLIC_SUPABASE_ANON_KEY:</h2>
            <code className="block p-2 bg-muted rounded break-all">
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
                : '❌ 未设置'}
            </code>
          </div>
          
          <div>
            <h2 className="font-medium mb-2">NEXT_PUBLIC_API_URL:</h2>
            <code className="block p-2 bg-muted rounded">
              {process.env.NEXT_PUBLIC_API_URL || '❌ 未设置'}
            </code>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded">
          <p className="text-sm text-muted-foreground">
            <strong>注意：</strong> 如果显示 "未设置"，说明环境变量在构建时没有被正确注入。
            需要在 Vercel Dashboard 中配置环境变量，然后重新部署。
          </p>
        </div>
      </div>
    </div>
  )
}



