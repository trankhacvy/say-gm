"use client"

import Image from "next/image"
import { Typography } from "./ui/typography"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import Link from "next/link"

export default function ComingSoon({
  showAction = false,
  backhref = "/",
}: {
  showAction?: boolean
  backhref?: string
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 py-20">
      <Typography as="h2" level="h5" className="font-bold">
        Coming Soon!
      </Typography>
      <Typography level="body4" color="secondary">
        We are currently working hard on this page!
      </Typography>
      {showAction && (
        <Link href={backhref}>
          <Button as="a">Go back home</Button>
        </Link>
      )}
      <div className="mx-auto w-full max-w-lg">
        <AspectRatio>
          <Image alt="working" src="/assets/working.png" fill />
        </AspectRatio>
      </div>
    </div>
  )
}
