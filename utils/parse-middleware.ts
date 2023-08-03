import { NextRequest } from "next/server"
import { APP_HOSTNAMES } from "./constants"

export function parseMiddlewareRequest(req: NextRequest) {
  let domain = req.headers.get("host") as string
  domain = domain.replace("www.", "") // remove www. from domain

  if (APP_HOSTNAMES.has(domain) || domain.endsWith(".vercel.app")) domain = "dub.sh"

  const path = req.nextUrl.pathname

  const key = decodeURIComponent(path.split("/")[1])
  const fullKey = decodeURIComponent(path.slice(1))
  console.log({ domain, path, key, fullKey })
  return { domain, path, key, fullKey }
}
