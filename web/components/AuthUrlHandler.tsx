'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'

/**
 * Handles auth redirects that use URL hash (fragment) instead of query code.
 * Supabase may send tokens in the hash; the server never sees the hash, so we
 * consume it on the client and then clean the URL so the Nav sees the session.
 */
export function AuthUrlHandler() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash) return
    // Supabase puts access_token, refresh_token, type in the fragment
    if (!hash.includes('access_token=') && !hash.includes('error=')) return

    const supabase = createClient()
    supabase.auth.getSession().then(() => {
      const path = window.location.pathname + window.location.search
      window.history.replaceState(null, '', path)
      router.replace(path, { scroll: false })
    })
  }, [router])

  return null
}
