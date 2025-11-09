import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseDifyOutputs } from "@/lib/dify";
import {
  extractResponsePayload,
  readPayloadNumber,
  stringifyPayloadValue,
} from "@/lib/response-payload";
import { createQuestionAnswerList, parseFormSchemaFields } from "@/lib/form-schema";

type RouteParams = { params: { id: string } };

export async function POST(_: Request, { params }: RouteParams) {
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: testimonial, error: testimonialLookupError } = await supa
    .from("testimonials")
    .select("id, response_id, company_id, is_public")
    .eq("id", params.id)
    .maybeSingle();

  if (testimonialLookupError || !testimonial) {
    return NextResponse.json(
      { error: testimonialLookupError?.message || "not found" },
      { status: 404 }
    );
  }

  const { data: response, error: responseError } = await supa
    .from("responses")
    .select("*")
    .eq("id", testimonial.response_id)
    .single();

  if (responseError || !response) {
    return NextResponse.json(
      { error: responseError?.message || "response not found" },
      { status: 404 }
    );
  }

  const { data: companySettings, error: companyError } = await supa
    .from("companies")
    .select("auto_publish_high_rating, form_schema")
    .eq("id", testimonial.company_id)
    .maybeSingle();

  if (companyError) {
    console.error("[auto-publish] failed to load company settings", companyError);
  }
  const autoPublishEnabled = Boolean(companySettings?.auto_publish_high_rating);

  const payload = extractResponsePayload(response);
  const rating = readPayloadNumber(payload, "rating") ?? null;
  const schemaFields = parseFormSchemaFields(companySettings?.form_schema);
  const questionAnswers = createQuestionAnswerList(payload, schemaFields);
  const formPayloadText = JSON.stringify({
    company_id: response.company_id,
    response_id: response.id,
    answers: questionAnswers.map(({ question, value }) => ({
      question,
      answer: stringifyPayloadValue(value),
    })),
  });

  const workflowPayload = {
    user: response.id,
    response_mode: "blocking",
    inputs: {
      form_payload: formPayloadText,
    },
  };

  const endpoint = `${
    process.env.DIFY_BASE_URL ?? "https://api.dify.ai"
  }/v1/workflows/run`;

  const difyRes = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workflowPayload),
  });

  if (!difyRes.ok) {
    const message = await difyRes.text();
    return NextResponse.json(
      { error: message || "dify error" },
      { status: 500 }
    );
  }

  const difyJson = await difyRes.json();
  console.log("[dify] workflow response", difyJson);

  const outputs = parseDifyOutputs(difyJson);

  const headline = typeof outputs.ai_headline === "string" ? outputs.ai_headline : "";
  const bodyText = typeof outputs.ai_body === "string" ? outputs.ai_body : "";
  const bullets = Array.isArray(outputs.ai_bullets)
    ? (outputs.ai_bullets as string[])
    : [];

  const { error: updateError } = await supa
    .from("testimonials")
    .update({
      ai_headline: headline,
      ai_body: bodyText,
      ai_bullets: bullets,
    })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const shouldAutoPublish =
    autoPublishEnabled &&
    typeof rating === "number" &&
    rating >= 4 &&
    testimonial.is_public !== true;

  if (shouldAutoPublish) {
    const { error: publishError } = await supa
      .from("testimonials")
      .update({
        is_public: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", params.id);

    if (publishError) {
      console.error("[auto-publish] failed to publish testimonial", {
        testimonialId: params.id,
        error: publishError,
      });
    }
  }

  return NextResponse.redirect(
    new URL(
      "/dashboard",
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    )
  );
}
