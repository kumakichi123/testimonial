import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type RouteParams = { params: { id: string } };

export async function POST(_: Request, { params }: RouteParams) {
  // server-only creds
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1) 対象テスティモの取得
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

  // 2) 紐づく回答の取得
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

  // 3) 会社設定の取得（自動公開フラグ）
  const { data: companySettings, error: companyError } = await supa
    .from("companies")
    .select("auto_publish_high_rating")
    .eq("id", testimonial.company_id)
    .maybeSingle();

  if (companyError) {
    // ここは致命ではない。ログのみ。
    console.error("[auto-publish] failed to load company settings", companyError);
  }
  const autoPublishEnabled = Boolean(companySettings?.auto_publish_high_rating);

  // 4) Dify 実行
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

  const json = await difyRes.json();

  // Dify の出力を安全にパース
  // 期待形: { data: { outputs: { ai_headline, ai_body, ai_bullets } } }
  const outputsRaw: unknown =
    json?.data?.outputs ??
    json?.data?.outputs?.outputs ?? // ワークフローによっては二重にネストされるケース
    {};

  let outputs: Record<string, unknown>;
  if (typeof outputsRaw === "string") {
    try {
      outputs = JSON.parse(outputsRaw);
    } catch {
      outputs = {};
    }
  } else if (outputsRaw && typeof outputsRaw === "object") {
    outputs = outputsRaw as Record<string, unknown>;
  } else {
    outputs = {};
  }

  const headline = typeof outputs.ai_headline === "string" ? outputs.ai_headline : "";
  const bodyText = typeof outputs.ai_body === "string" ? outputs.ai_body : "";
  const bullets = Array.isArray(outputs.ai_bullets)
    ? (outputs.ai_bullets as string[])
    : [];

  // 5) AI結果を保存
  const { error: updateError } = await supa
    .from("testimonials")
    .update({
      ai_headline: headline,
      ai_body: bodyText,
      ai_bullets: bullets, // カラム型は jsonb 推奨
    })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 6) 自動公開の判定と適用
  const shouldAutoPublish =
    autoPublishEnabled &&
    typeof response.rating === "number" &&
    response.rating >= 4 &&
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
      // 失敗しても致命ではないので続行
    }
  }

  // 7) 正常終了
  return NextResponse.redirect(
    new URL(
      "/dashboard",
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    )
  );
}
