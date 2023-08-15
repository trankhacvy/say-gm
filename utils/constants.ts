export const REDIRECT_HEADERS = {
  headers: {
    "x-powered-by": "vercel.com - Buy me a coffee",
  },
}

export const APP_HOSTNAMES = new Set(["app.dub.sh", "app.localhost:3000", "app.localhost", "preview.dub.sh"])

export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://app.dub.sh"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://preview.dub.sh"
    : "http://app.localhost:3000"

export const DEFAULT_REDIRECTS = {}

export const AUDIENCE_OPTIONS = [
  { label: "Everyone (Public)", value: "public" },
  { label: "All Supporters (One-off & Monthly)", value: "supporters" },
  { label: "All Monthly Supporters (Members)", value: "members" },
]

export const AUDIENCE_OPTIONS_MAP = {
  public: "Everyone (Public)",
  supporters: "All Supporters (One-off & Monthly)",
  members: "All Monthly Supporters (Members)",
}


export enum AUDIENCE_OPTIONS_ENUM {
  public = "public",
  supporters = "supporters",
  members = "members",
}