import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url))
  const supa = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
      }
    }
  )
  await supa.auth.signOut()
  return res
}
