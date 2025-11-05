import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const updateSchema = z.object({
  ai_headline: z.string().trim().min(1),
  ai_body: z.string().trim().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const parseResult = updateSchema.safeParse({
    ai_headline: formData.get("ai_headline"),
    ai_body: formData.get("ai_body"),
  });

  if (!parseResult.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const { ai_headline, ai_body } = parseResult.data;

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supa
    .from("testimonials")
    .update({
      ai_headline,
      ai_body,
    })
    .eq("id", params.id)
    .select("ai_headline, ai_body")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "not found" },
      { status: error ? 500 : 404 }
    );
  }

  return NextResponse.json({
    ai_headline: data.ai_headline ?? "",
    ai_body: data.ai_body ?? "",
  });
}
