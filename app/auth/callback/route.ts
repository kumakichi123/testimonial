import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/login?error=認証コードが見つかりませんでした。もう一度メールのリンクを開いてください。",
        url.origin
      )
    );
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(
      new URL(
        "/login?error=認証リンクが無効または期限切れです。再送してください。",
        url.origin
      )
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(
        "/login?error=セッションを確立できませんでした。もう一度ログインしてください。",
        url.origin
      )
    );
  }

  // Check whether the user already belongs to a company.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: membership } = await supabaseAdmin
    .from("memberships")
    .select("company_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const destination =
    membership?.company_id ? "/dashboard" : "/signup?step=profile";
  const redirectTarget = next && next !== "/signup" ? next : destination;

  return NextResponse.redirect(new URL(redirectTarget, url.origin));
}
