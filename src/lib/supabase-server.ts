import { cookies, headers } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

export function createServerSupabase(): SupabaseClient {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // `cookies()` が読み取り専用の場合があるため、try/catch で保護
              cookieStore.set?.(name, value, options)
            })
          } catch (error) {
            console.warn("Supabase cookie setAll failed", error)
          }
        },
      },
      global: {
        headers: {
          "X-Forwarded-For": headers().get("x-forwarded-for") ?? "",
        },
      },
    }
  )
}
