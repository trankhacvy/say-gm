import type { SiteConfig } from "@/types"
import { APP_URL } from "@/utils/env"

export const siteConfig: SiteConfig = {
  name: "Say GM",
  description: "Say gm to your fans on Solana",
  url: APP_URL,
  ogImage: `${APP_URL}/assets/hero.png`,
  links: {
    twitter: "https://twitter.com/trankhac_vy",
    github: "https://github.com/trankhacvy",
  },
}
