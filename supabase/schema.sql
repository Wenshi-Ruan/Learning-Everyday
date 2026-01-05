-- Supabase 数据库 Schema
-- 运行此 SQL 在 Supabase SQL Editor 中创建表

-- 1. 公司浏览历史表
CREATE TABLE IF NOT EXISTS company_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT,
  company_name TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  content_cache_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_company_views_user_id ON company_views(user_id);
CREATE INDEX IF NOT EXISTS idx_company_views_viewed_at ON company_views(viewed_at DESC);

-- 2. 打卡记录表
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL, -- 用户时区的日期 (YYYY-MM-DD)
  ticker TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date) -- 同一用户同一天只能有一个打卡
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(date DESC);
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, date DESC);

-- 3. 公司内容缓存表
CREATE TABLE IF NOT EXISTS company_content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT,
  company_name TEXT NOT NULL,
  content_json JSONB NOT NULL, -- 完整的 FactPack JSON
  content_text TEXT NOT NULL, -- Markdown 文章
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_version TEXT, -- 可选：代码版本号
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_content_cache_ticker ON company_content_cache(ticker);
CREATE INDEX IF NOT EXISTS idx_content_cache_generated_at ON company_content_cache(generated_at DESC);

-- Row Level Security (RLS) 策略

-- company_views: 用户只能看到自己的记录
ALTER TABLE company_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company views"
  ON company_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company views"
  ON company_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- checkins: 用户只能看到和创建自己的打卡记录
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checkins"
  ON checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checkins"
  ON checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- company_content_cache: 所有人可读（缓存是共享的）
ALTER TABLE company_content_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached content"
  ON company_content_cache FOR SELECT
  USING (true);

-- 注意：插入缓存可能需要服务端角色，或者创建一个服务端函数
-- 这里先允许认证用户插入（生产环境建议用服务端函数）
CREATE POLICY "Authenticated users can insert cache"
  ON company_content_cache FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

