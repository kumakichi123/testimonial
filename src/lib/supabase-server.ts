import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
// 戻り値の型注釈は付けない（各バージョン差異を吸収）
import type { Database } from "@/lib/database.types";

export function createServerSupabase() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set?.(name, value, options);
            });
          } catch (error) {
            console.warn("Supabase cookie setAll failed", error);
          }
        },
      },
      global: {
        headers: {
          "X-Forwarded-For": headers().get("x-forwarded-for") ?? "",
        },
      },
    }
  );
}
