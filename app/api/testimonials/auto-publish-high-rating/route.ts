import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { autoPublishHighRatingTestimonials } from "@/lib/auto-publish";

const requestSchema = z.object({
  companyId: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const outcome = await autoPublishHighRatingTestimonials(
    supa,
    parsed.data.companyId
  );

  if (outcome.kind === "error") {
    return NextResponse.json({ error: outcome.error }, { status: 500 });
  }

  if (outcome.kind === "empty") {
    return NextResponse.json({
      message: "公開対象となるクチコミがまだありません。",
      updated: 0,
    });
  }

  if (outcome.kind === "none") {
    return NextResponse.json({
      message: "☆4以上の新しい公開対象は見つかりませんでした。",
      updated: 0,
    });
  }

  return NextResponse.json({
    message: `☆4以上の${outcome.updated}件を公開しました。`,
    updated: outcome.updated,
  });
}
