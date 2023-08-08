"use client"

import Image from "next/image"
import { AspectRatio } from "../ui/aspect-ratio"
import { Typography } from "../ui/typography"

type PostCardProps = {
  title: string
  body: string
}

export default function PostCard({ title, body }: PostCardProps) {
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
          <Typography className="font-semibold">{title}</Typography>
        </div>
      </div>
      <div className="px-6 pb-4 pt-6">
        <Typography as="p" level="body4">
          {body}
        </Typography>
      </div>
      <div className="p-2">
        <AspectRatio ratio={16 / 9}>
          <Image className="rounded-xl" alt="profile" src="/assets/product.jpg" fill />
        </AspectRatio>
      </div>
    </div>
  )
}
