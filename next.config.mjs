import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({ enabled: false })]], {
  reactStrictMode: true,
  images: {
    domains: ["api-prod-minimal-v510.vercel.app", "phxfamlbmycvwkfohlxz.supabase.co"],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs")
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
})

export default config
