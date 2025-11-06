import { notFound } from "next/navigation"
import { createServerSupabase } from "@/lib/supabase-server"
import Form from "./form"

export default async function FormPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase()
  const { data: form } = await supabase.from("forms").select("id, company_id").eq("slug", params.slug).maybeSingle()

  if (!form) return notFound()

  return <Form slug={params.slug} />
}
