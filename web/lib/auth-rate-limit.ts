/**
 * Supabase auth email rate limit handling.
 * Built-in Supabase email is ~4 per hour; limit cannot be increased without custom SMTP.
 * See: https://supabase.com/docs/guides/auth/rate-limits
 */

const RATE_LIMIT_KEYWORDS = ['rate limit', 'rate_limit', '429', 'too many']

export function isEmailRateLimitError(error: { message?: string } | string): boolean {
  const msg = typeof error === 'string' ? error : (error?.message ?? '')
  const lower = msg.toLowerCase()
  return RATE_LIMIT_KEYWORDS.some((k) => lower.includes(k))
}

/** User-friendly message when email rate limit is hit */
export const RATE_LIMIT_MESSAGE_ZH =
  '发送次数过多，请约 1 小时后再试。若已设置密码，请使用「密码登录」直接登录。'
export const RATE_LIMIT_MESSAGE_EN =
  'Too many attempts. Please try again in about an hour, or use password login if you have an account.'

/** Cooldown in seconds before allowing another email send (reduces accidental limit hits) */
export const EMAIL_SEND_COOLDOWN_SEC = 60
