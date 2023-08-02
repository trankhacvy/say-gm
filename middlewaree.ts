import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import { APP_HOSTNAMES, parseMiddlewareRequest } from "./utils/parse-middleware"
import { REDIRECT_HEADERS } from "./utils/constants"
import { getToken } from "next-auth/jwt"

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain, path, key } = parseMiddlewareRequest(req)
  console.log("domain", domain)
  if (APP_HOSTNAMES.has(domain)) {
    const session = await getToken({
      req,
      secret: "",
    })

    // if there's no session and the path isn't /login or /register, redirect to /login
    if (!session?.email && path !== "/login" && path !== "/register") {
      return NextResponse.redirect(new URL(`/login${path !== "/" ? `?next=${encodeURIComponent(path)}` : ""}`, req.url))

      // if there's a session
    }

    return NextResponse.rewrite(new URL(`/app${path}`, req.url))
  }

  return NextResponse.redirect(new URL("/", req.url), REDIRECT_HEADERS)
}
