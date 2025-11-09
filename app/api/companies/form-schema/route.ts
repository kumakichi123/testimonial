import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { parseDifyOutputs } from "@/lib/dify";

const payloadSchema = z.object({
  companyId: z.string().trim().min(1),
  fields: z
    .array(
      z.object({
        key: z.string().trim().min(1),
        label: z.string().trim().min(1),
        type: z.string().optional(),
        required: z.boolean().optional(),
      })
    )
    .min(1),
});

const REQUIRED_KEYS = ["name", "rating"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const keySet = new Set<string>(parsed.data.fields.map((field) => field.key));
  for (const required of REQUIRED_KEYS) {
    if (!keySet.has(required)) {
      return NextResponse.json(
        { error: `missing required field: ${required}` },
        { status: 400 }
      );
    }
  }

  const difyApiKey = process.env.DIFY_FORM_API_KEY;
  const difyBase =
    process.env.DIFY_BASE_URL?.replace(/\/$/, "") ?? "https://api.dify.ai";

  if (!difyApiKey) {
    return NextResponse.json(
      { error: "dify workflow is not configured" },
      { status: 500 }
    );
  }

  const endpoint = `${difyBase}/v1/workflows/run`;
  const workflowPayload = {
    response_mode: "blocking",
    inputs: {
      company_id: parsed.data.companyId,
      fields: parsed.data.fields,
    },
  };

  const difyRes = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${difyApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workflowPayload),
  });

  if (!difyRes.ok) {
    const message = await difyRes.text();
    return NextResponse.json(
      { error: message || "dify workflow failed" },
      { status: 500 }
    );
  }

  const json = await difyRes.json();
  const outputs = parseDifyOutputs(json);
  const schema = (outputs.form_schema as Record<string, unknown> | undefined) ?? outputs;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("companies")
    .update({ form_schema: schema })
    .eq("id", parsed.data.companyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, schema });
}
