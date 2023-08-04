"use client"

import { MenuIcon, UserIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/utils/cn"

export function UserPageHeader() {
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
      className={cn("fixed right-0 top-0 z-10 h-16 w-full transition-[height] duration-200 ease-in-out lg:h-20", {
        "lg:h-[60px]": small,
      })}
    >
      <div className="relative mx-auto flex h-full min-h-[56px] w-full max-w-screen-xl items-center px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <IconButton className="mr-2 lg:hidden" size="sm">
          <MenuIcon />
        </IconButton>
        <div className="flex grow items-center justify-end gap-2">
          <UserIcon />
        </div>
      </div>
    </header>
  )
}
