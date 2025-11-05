import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard-client";

export const revalidate = 0;

export default async function DashboardPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the company the user belongs to via memberships using the service role key.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: membership } = await supabaseAdmin
    .from("memberships")
    .select("company_id, company:companies(*), role, created_at, user_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  // `company:companies(*)` は配列を返すため、最初の要素を取得する
  const company = Array.isArray(membership?.company)
    ? membership.company[0]
    : membership?.company;

  if (!company) {
    redirect("/signup");
  }

  const { data: form } = await supabaseAdmin
    .from("forms")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: testimonials } = await supabaseAdmin
    .from("testimonials")
    .select("*, responses(*)")
    .eq("company_id", company.id);

  const { data: membershipRows, error: membershipListError } = await supabaseAdmin
    .from("memberships")
    .select("user_id, role, created_at")
    .eq("company_id", company.id);

  if (membershipListError) {
    console.error("Failed to fetch memberships:", membershipListError);
  }

  const members =
    membershipRows && membershipRows.length
      ? await Promise.all(
          membershipRows.map(async (memberRow: any, index: number) => {
            let email: string | null = null;
            let status: "pending" | "active" = "pending";
            let joinedAt: string | null = memberRow.created_at ?? null;

            if (memberRow.user_id) {
              const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
                memberRow.user_id
              );

              if (userError) {
                console.error(`Failed to load auth user ${memberRow.user_id}`, userError);
              }

              const authUser = userData?.user;
              email = authUser?.email ?? email;

              const confirmedAt =
                (authUser?.email_confirmed_at as string | null | undefined) ??
                (authUser?.confirmed_at as string | null | undefined) ??
                null;

              status = confirmedAt ? "active" : "pending";
              joinedAt = authUser?.last_sign_in_at ?? confirmedAt ?? joinedAt;
            }

            return {
              id: memberRow.user_id ?? `pending-${index}`,
              email,
              role: (memberRow.role as string | null) ?? "member",
              status,
              joinedAt,
            };
          })
        )
      : [];

  return (
    <Dashboard
      company={company}
      form={form}
      testimonials={testimonials}
      members={members}
      membershipRole={membership?.role ?? "member"}
      selfMembership={membership}
      currentUserId={user.id}
    />
  );
}
