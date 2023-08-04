"use client"

import Image from "next/image"
import { Typography } from "../ui/typography"
import { AspectRatio } from "../ui/aspect-ratio"
import { Button } from "../ui/button"
import { ArrowRightIcon } from "lucide-react"

export default function Hero() {
  return (
    <div className="bg-image-blur relative">
      <div className="mx-auto flex min-h-screen max-w-screen-xl items-center px-4 py-28 md:px-6 lg:px-10">
        <div className="-mx-10 flex w-full flex-wrap items-center">
          <div className="w-5/12 px-10">
            <Typography as="h1" level="h2" className="mb-10 font-extrabold leading-snug tracking-widest">
              Say <span className="text-primary-500 underline">gm</span> to <br /> Your Fans <br /> On <span className="text-purple-700">Solana</span>
            </Typography>
            <Button size="lg" endDecorator={<ArrowRightIcon />}>
              Ready Start
            </Button>
          </div>
          <div className="relative w-7/12 px-10">
            <AspectRatio>
              <Image src="/assets/hero.jpg" fill alt="hero" />
            </AspectRatio>
          </div>
        </div>
      </div>
    </div>
  )
}
