import type { Metadata } from "next"
import "@/styles/globals.css"
import { siteConfig } from "@/config/site"
import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/utils/cn"
import Providers from "./providers"
require("@solana/wallet-adapter-react-ui/styles.css")

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Server Actions",
    "Skateshop",
    "Skateboard",
    "Skateboarding",
    "Kickflip",
  ],
  authors: [
    {
      name: "sadmann7",
      url: "https://github.com/sadmann7",
    },
  ],
  creator: "sadmann7",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@sadmann7",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={cn("bg-background min-h-screen font-sans antialiased", fontSans.variable, fontMono.variable)}>
          <Providers>{children}</Providers>
          {/* <Toaster /> */}
        </body>
      </html>
    </>
  )
}
