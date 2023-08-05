"use client"

import Image from "next/image"
import { Typography } from "../ui/typography"
import { AspectRatio } from "../ui/aspect-ratio"

export default function Feed() {
  return (
    <div className="w-full rounded-2xl bg-white shadow-card">
      <div className="flex items-center gap-4 px-6 pt-6">
        <Image
          width={40}
          height={40}
          alt="profile"
          src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg"
          className="rounded-full"
        />
        <div className="flex-1">
          <Typography className="font-semibold">David</Typography>
        </div>
      </div>
      <div className="px-6 pb-4 pt-6">
        <Typography as="p" level="body4">
          The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.
        </Typography>
      </div>
      <div className="p-2">
        <AspectRatio ratio={16 / 9}>
          <Image
            className="rounded-xl"
            alt="profile"
            src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg"
            fill
          />
        </AspectRatio>
      </div>
    </div>
  )
}
