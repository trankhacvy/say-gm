import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { Routes } from "./config/routes"

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

const protectedPaths = [Routes.DASHBOARD, Routes.POSTS, Routes.MY_SUPPORTERS, Routes.MEMBERSHIPS, Routes.SETTINGS]

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl

  const hostname = req.headers.get("host")!

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname

  console.log({ hostname, path })

  if (protectedPaths.some((route) => path.startsWith(route))) {
    const session = await getToken({ req })
    // console.log('[middleware] check session: ', session);
    if (!session) {
      // TODO check if user is in un-protected paths
      return NextResponse.redirect(new URL("/", req.url))
    } else if (session && !session.user?.domain_name) {
      return NextResponse.redirect(new URL("/welcome", req.url))
    }
    return NextResponse.rewrite(new URL(path, req.url))
  }

  // rewrite root application to `/home` folder
  if (path === "/") {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url))
  }

  return NextResponse.rewrite(new URL(path, req.url))
}
