'use client'
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export function createBrowserSupabase(): SupabaseClient<Database, 'public'> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
