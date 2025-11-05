import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"

const bodySchema = z.object({
  name: z.string().min(1),
  problem: z.string().min(1),
  result: z.string().min(1),
  content: z.string().min(1),
  heard_from: z.string().optional().default(""),
  rating: z.coerce.number().int().min(1).max(5),
  reason: z.string().optional().default(""),
})

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const formData = await req.formData()
  const parsed = bodySchema.parse({
    name: formData.get("name"),
    problem: formData.get("problem"),
    result: formData.get("result"),
    content: formData.get("content"),
    heard_from: formData.get("heard_from") ?? "",
    rating: formData.get("rating"),
    reason: formData.get("reason") ?? "",
  })

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: form } = await supa
    .from("forms")
    .select("id, company_id")
    .eq("slug", params.slug)
    .maybeSingle()

  if (!form) {
    return NextResponse.json({ error: "form not found" }, { status: 404 })
  }

  const { data: resp, error } = await supa
    .from("responses")
    .insert({
      company_id: form.company_id,
      form_id: form.id,
      name: parsed.name,
      problem: parsed.problem,
      result: parsed.result,
      content: parsed.content,
      rating: parsed.rating,
      heard_from: parsed.heard_from,
      reason: parsed.reason,
    })
    .select("id, company_id")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: testimonial, error: testimonialError } = await supa
    .from("testimonials")
    .upsert({ company_id: resp.company_id, response_id: resp.id })
    .select()
    .single()

  if (testimonialError) {
    return NextResponse.json({ error: testimonialError.message }, { status: 500 })
  }

  if (testimonial) {
    fetch(new URL(`/api/testimonials/${testimonial.id}/rerun`, req.url), {
      method: "POST",
    })
  }

  return NextResponse.redirect(new URL(`/form/${params.slug}/thanks`, req.url))
}
