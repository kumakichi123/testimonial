import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import FormBuilderClient from "./form-builder-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FormBuilderPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: membership } = await supabaseAdmin
    .from("memberships")
    .select("company_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership?.company_id) {
    redirect("/signup");
  }

  const { data: company } = await supabaseAdmin
    .from("companies")
    .select("id, name, form_schema")
    .eq("id", membership.company_id)
    .maybeSingle();

  if (!company) {
    redirect("/dashboard");
  }

  return <FormBuilderClient company={company} />;
}
