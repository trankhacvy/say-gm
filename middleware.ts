import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
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
  const url = req.nextUrl

  const hostname = req.headers.get("host")!

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname

  console.log({ hostname, path })

  if (path.startsWith("/u")) {
    const session = await getToken({ req })

    if (session && !session.user?.domain_name) {
      return NextResponse.redirect(new URL("/welcome", req.url))
    }
  }

  // rewrites for app pages
  // if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
  //   const session = await getToken({ req })
  //   console.log("check session", session)

  //   if (!session && path !== "/login") {
  //     return NextResponse.redirect(new URL("/login", req.url))
  //   } else if (session && path == "/login") {
  //     return NextResponse.redirect(new URL("/", req.url))
  //   }
  //   return NextResponse.rewrite(new URL(`/app${path === "/" ? "" : path}`, req.url))
  // }

  // rewrite root application to `/home` folder
  if (path === "/") {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url))
  }

  return NextResponse.rewrite(new URL(path, req.url))
}
