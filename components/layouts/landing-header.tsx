"use client"

import { cn } from "@/utils/cn"
import { useEffect, useState } from "react"
import { IconButton } from "../ui/icon-button"
import { MenuIcon, SearchIcon, Settings2Icon, UserIcon } from "lucide-react"
import { Button } from "../ui/button"

export function LandingHeader() {
  const [small, setSmall] = useState(false)

  useEffect(() => {
    function handler() {
      setSmall(window.pageYOffset > 60)
    }

    window.addEventListener("scroll", handler)

    return () => {
      window.removeEventListener("scroll", handler)
    }
  }, [])

  return (
    <header
      className={cn("fixed right-0 top-0 z-10 h-16 w-full transition duration-200 ease-in-out lg:h-20", {
        "bg-white/80 lg:h-[60px]": small,
      })}
      style={{
        transitionProperty: "height,background-color",
      }}
    >
      <div className="relative mx-auto flex h-full min-h-[56px] w-full max-w-screen-xl items-center justify-between px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <a href="/" className="font-bold">
          OPOS
        </a>

        <div className="flex grow items-center justify-end gap-2">
          <Button>Connect Wallet</Button>
        </div>
      </div>
      {small && <div className="absolute inset-x-0 bottom-0 z-[-1] h-6 rounded-[50%] opacity-40 shadow-dropdown" />}
    </header>
  )
}
