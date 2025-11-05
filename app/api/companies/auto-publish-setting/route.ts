import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { autoPublishHighRatingTestimonials } from "@/lib/auto-publish";

const payloadSchema = z.object({
  companyId: z.string().min(1),
  enabled: z.boolean(),
});

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  const parsed = payloadSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: updateError } = await supa
    .from("companies")
    .update({ auto_publish_high_rating: parsed.data.enabled })
    .eq("id", parsed.data.companyId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (!parsed.data.enabled) {
    return NextResponse.json({
      message: "自動公開をオフにしました。",
      updated: 0,
      enabled: false,
    });
  }

  const outcome = await autoPublishHighRatingTestimonials(
    supa,
    parsed.data.companyId
  );

  if (outcome.kind === "error") {
    return NextResponse.json({ error: outcome.error }, { status: 500 });
  }

  if (outcome.kind === "empty") {
    return NextResponse.json({
      message:
        "自動公開をオンにしました。公開対象となるクチコミがまだありません。",
      updated: 0,
      enabled: true,
    });
  }

  if (outcome.kind === "none") {
    return NextResponse.json({
      message:
        "自動公開をオンにしました。☆4以上の新しい公開対象は見つかりませんでした。",
      updated: 0,
      enabled: true,
    });
  }

  return NextResponse.json({
    message: `自動公開をオンにしました。☆4以上の${outcome.updated}件を公開しました。`,
    updated: outcome.updated,
    enabled: true,
  });
}
