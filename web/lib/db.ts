/**
 * 数据库操作：Supabase 表操作
 * 注意：这些函数需要在 Server Component 或 Server Action 中调用
 */
import { createClient } from './supabase/server';

export interface CompanyView {
  id?: string;
  user_id: string;
  ticker: string | null;
  company_name: string;
  viewed_at: string;
  content_cache_id?: string;
}

export interface Checkin {
  id?: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  ticker?: string | null;
  company_name?: string | null;
  created_at?: string;
}

export interface CompanyContentCache {
  id?: string;
  ticker: string | null;
  company_name: string;
  content_json: any;
  content_text: string;
  generated_at: string;
  source_version?: string;
}

/**
 * 记录公司浏览历史
 */
export async function recordCompanyView(
  userId: string,
  ticker: string | null,
  companyName: string,
  contentCacheId?: string
): Promise<void> {
  const supabase = await createClient();
  
  await supabase.from('company_views').insert({
    user_id: userId,
    ticker,
    company_name: companyName,
    viewed_at: new Date().toISOString(),
    content_cache_id: contentCacheId,
  });
}

/**
 * 获取用户浏览历史
 */
export async function getUserHistory(userId: string, limit = 50): Promise<CompanyView[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('company_views')
    .select('*')
    .eq('user_id', userId)
    .order('viewed_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

/**
 * 记录打卡
 */
export async function recordCheckin(
  userId: string,
  date: string,
  ticker?: string | null,
  companyName?: string | null
): Promise<Checkin> {
  const supabase = await createClient();
  
  // 检查是否已打卡（唯一性约束）
  const { data: existing } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();
  
  if (existing) {
    return existing;
  }
  
  const { data, error } = await supabase
    .from('checkins')
    .insert({
      user_id: userId,
      date,
      ticker,
      company_name: companyName,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * 检查用户今天是否已打卡
 */
export async function hasCheckedInToday(userId: string, date: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('checkins')
    .select('id')
    .eq('user_id', userId)
    .eq('date', date)
    .single();
  
  return !error && !!data;
}

/**
 * 获取用户打卡记录
 */
export async function getUserCheckins(userId: string, limit = 100): Promise<Checkin[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

/**
 * 计算连续打卡天数（streak）
 */
export async function calculateStreak(userId: string): Promise<number> {
  const checkins = await getUserCheckins(userId, 365);
  
  if (checkins.length === 0) return 0;
  
  // 按日期排序（降序）
  const sortedDates = checkins
    .map(c => c.date)
    .sort((a, b) => b.localeCompare(a));
  
  // 计算连续天数
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let expectedDate = today;
  
  for (const date of sortedDates) {
    if (date === expectedDate) {
      streak++;
      // 计算前一天
      const prevDate = new Date(expectedDate);
      prevDate.setDate(prevDate.getDate() - 1);
      expectedDate = prevDate.toISOString().split('T')[0];
    } else if (date < expectedDate) {
      // 如果日期不连续，停止计算
      break;
    }
  }
  
  return streak;
}

/**
 * 获取最近30天的打卡日历数据
 */
export async function getCheckinCalendar(userId: string): Promise<Record<string, boolean>> {
  const checkins = await getUserCheckins(userId, 30);
  const calendar: Record<string, boolean> = {};
  
  checkins.forEach(checkin => {
    calendar[checkin.date] = true;
  });
  
  return calendar;
}

/**
 * 缓存公司内容
 */
export async function cacheCompanyContent(
  ticker: string | null,
  companyName: string,
  contentJson: any,
  contentText: string
): Promise<string> {
  const supabase = await createClient();
  
  // 检查是否已有缓存（24小时内）
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const { data: existing } = await supabase
    .from('company_content_cache')
    .select('id')
    .eq('ticker', ticker || '')
    .gte('generated_at', oneDayAgo.toISOString())
    .single();
  
  if (existing) {
    return existing.id;
  }
  
  // 创建新缓存
  const { data, error } = await supabase
    .from('company_content_cache')
    .insert({
      ticker,
      company_name: companyName,
      content_json: contentJson,
      content_text: contentText,
      generated_at: new Date().toISOString(),
    })
    .select('id')
    .single();
  
  if (error) throw error;
  return data.id;
}

/**
 * 获取缓存的公司内容
 */
export async function getCachedContent(
  ticker: string | null
): Promise<CompanyContentCache | null> {
  const supabase = await createClient();
  
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const { data, error } = await supabase
    .from('company_content_cache')
    .select('*')
    .eq('ticker', ticker || '')
    .gte('generated_at', oneDayAgo.toISOString())
    .order('generated_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) return null;
  return data;
}

