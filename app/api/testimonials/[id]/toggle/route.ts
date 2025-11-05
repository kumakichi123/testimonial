import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(_: Request, { params }: { params: { id: string }}) {
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: t } = await supa.from("testimonials").select("id, is_public").eq("id", params.id).maybeSingle()
  if (!t) return NextResponse.json({ error: "not found" }, { status: 404 })

  const next = !t.is_public
  await supa.from("testimonials").update({
    is_public: next,
    published_at: next ? new Date().toISOString() : null
  }).eq("id", params.id)

  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"))
}
