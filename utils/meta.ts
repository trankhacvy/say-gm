import { siteConfig } from "@/config/site"
import { Metadata } from "next"

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@vincenzo",
    },
    icons,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    themeColor: "#FFF",
  }
}
