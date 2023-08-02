import { NextRequest } from "next/server"

export const APP_HOSTNAMES = new Set(["app.vercel.com", "app.localhost:3000", "app.localhost", "preview.vercel.sh"])

export function parseMiddlewareRequest(req: NextRequest) {
  let domain = req.headers.get("host") as string
  domain = domain.replace("www.", "") // remove www. from domain

  if (APP_HOSTNAMES.has(domain) || domain.endsWith(".vercel.app")) domain = "vercel.com"

  const path = req.nextUrl.pathname

  const key = decodeURIComponent(path.split("/")[1])
  const fullKey = decodeURIComponent(path.slice(1))

  return { domain, path, key, fullKey }
}
