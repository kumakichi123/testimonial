export const revalidate = 0;
export const dynamic = "force-dynamic";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import TestimonialWidget, { TestimonialItem } from "./widget";
import {
  extractResponsePayload,
  readPayloadNumber,
  readPayloadString,
} from "@/lib/response-payload";

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: { company: string };
  searchParams: { token?: string };
}) {
  const token = searchParams.token ?? "";
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: company } = await supa
    .from("companies")
    .select("id")
    .eq("slug", params.company)
    .eq("iframe_token", token)
    .maybeSingle();

  if (!company) {
    return notFound();
  }

  const { data: testimonialsData } = await supa
    .from("testimonials")
    .select(
      "id, ai_headline, ai_body, published_at, responses(payload, created_at)"
    )
    .eq("company_id", company.id)
    .eq("is_public", true)
    .order("published_at", { ascending: false, nullsFirst: true });

  const items: TestimonialItem[] = (testimonialsData || []).map((t: any) => {
    const payload = extractResponsePayload(t.responses);
    return {
      id: t.id,
      title: t.ai_headline,
      body: t.ai_body,
      name: readPayloadString(payload, "name"),
      date: (() => {
        const sourceDate = t.published_at ?? t.responses?.created_at;
        if (!sourceDate) return undefined;
        const date = new Date(sourceDate);
        if (Number.isNaN(date.valueOf())) return undefined;
        return date.toISOString().split("T")[0];
      })(),
      rating: readPayloadNumber(payload, "rating"),
    };
  });

  return <TestimonialWidget items={items} />;
}
