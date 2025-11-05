import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { updateSession } from "./src/lib/update-session"

export async function middleware(req: NextRequest) {
  // iframe 埋め込み許可。会社サイトからのみ。
  const res = await updateSession(req)
  const origins = (process.env.EMBED_ALLOWED_ORIGINS ?? "").split(" ").filter(Boolean)
  // 通常ページは自己オリジンのみ、/embed/* は allow-list を付与
  const url = new URL(req.url)
  if (url.pathname.startsWith("/embed/")) {
    const dir = ["'self'", ...origins].join(" ")
    res.headers.set("Content-Security-Policy", `frame-ancestors ${dir};`)
  } else {
    res.headers.set("Content-Security-Policy", "frame-ancestors 'self';")
  }
  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
