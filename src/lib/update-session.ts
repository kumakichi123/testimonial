import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

/** セッションCookieを最新化。Next公式の Cookie API に沿う。 */
export async function updateSession(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll().map(c => ({ name: c.name, value: c.value })),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
      }
    }
  )
  // 触っておくと更新が走る
  await supabase.auth.getUser().catch(() => null)
  return res
}
