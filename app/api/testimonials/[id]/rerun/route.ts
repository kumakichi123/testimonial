import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: testimonial, error: testimonialLookupError } = await supa
    .from("testimonials")
    .select("id, response_id, company_id, is_public")
    .eq("id", params.id)
    .maybeSingle()

  if (testimonialLookupError || !testimonial) {
    return NextResponse.json(
      { error: testimonialLookupError?.message || "not found" },
      { status: 404 }
    )
  }

  const { data: response, error: responseError } = await supa
    .from("responses")
    .select("*")
    .eq("id", testimonial.response_id)
    .single()

  if (responseError || !response) {
    return NextResponse.json(
      { error: responseError?.message || "response not found" },
      { status: 404 }
    )
  }

  const workflowPayload = {
    user: response.id,
    response_mode: "blocking",
    inputs: {
      problem: response.problem,
      result: response.result,
      reason: response.reason ?? "",
      rating: response.rating,
      request_title: response.name,
      content: response.content ?? "",
    },
  }

  const endpoint = `${
    process.env.DIFY_BASE_URL ?? "https://api.dify.ai"
  }/v1/workflows/run`

  const difyResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workflowPayload),
  })

  if (!difyResponse.ok) {
    const message = await difyResponse.text()
    return NextResponse.json(
      { error: message || "dify error" },
      { status: 500 }
    )
  }

  const json = await difyResponse.json()

  let outputs: Record<string, unknown> = {}
  const outputString = json?.data?.outputs?.outputs

  if (typeof outputString === "string") {
    try {
      outputs = JSON.parse(outputString)
    } catch {
      outputs = {}
    }
  }

  const headline =
    typeof outputs.ai_headline === "string" ? outputs.ai_headline : ""
  const bodyText =
    typeof outputs.ai_body === "string" ? outputs.ai_body : ""
  const bullets = Array.isArray(outputs.ai_bullets)
    ? (outputs.ai_bullets as string[])
    : []

  const { error: updateError } = await supa
    .from("testimonials")
    .update({
      ai_headline: headline,
      ai_body: bodyText,
      ai_bullets: bullets,
    })
    .eq("id", params.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  if (shouldAutoPublish) {
    const { error: publishError } = await supa
      .from("testimonials")
      .update({
        is_public: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (publishError) {
      console.error("[auto-publish] failed to publish testimonial", {
        testimonialId: params.id,
        error: publishError,
      })
    }
  }

  return NextResponse.redirect(
    new URL(
      "/dashboard",
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    )
  )
}
  const { data: companySettings, error: companyError } = await supa
    .from("companies")
    .select("auto_publish_high_rating")
    .eq("id", testimonial.company_id)
    .maybeSingle()

  if (companyError) {
    console.error(
      "[auto-publish] failed to load company settings",
      companyError
    )
  }

  const autoPublishEnabled = Boolean(
    companySettings?.auto_publish_high_rating
  )
  const shouldAutoPublish =
    autoPublishEnabled &&
    typeof response.rating === "number" &&
    response.rating >= 4 &&
    testimonial.is_public !== true
