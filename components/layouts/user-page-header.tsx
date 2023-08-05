"use client"

import { MenuIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/utils/cn"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Typography } from "../ui/typography"
import { Separator } from "../ui/separator"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Skeleton } from "../ui/skeleton"

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
          <AdminUserMenu />
        </div>
      </div>
    </header>
  )
}

const AdminUserMenu = () => {
  const { data: session, status } = useSession()

  if (status === "unauthenticated") return null

  if (status === "loading") return <Skeleton className="h-10 w-10 rounded-full" />

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Avatar>
            {/* @ts-ignore */}
            <AvatarImage src={session?.user.profile_metadata?.avatar} alt={session?.user?.profile_metadata?.name} />
            <AvatarFallback className="bg-primary-500 text-xl text-white">
              {/* @ts-ignore */}
              {session?.user?.profile_metadata?.name?.charAt(0)}A
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <div className="px-5 py-3">
          <Typography className="truncate font-semibold" as="h6" level="body4">
            {/* @ts-ignore */}
            {session?.user?.profile_metadata?.name}
          </Typography>
        </div>
        <Separator />
        <div className="p-2">
          <li
            onClick={() => {
              signOut()
            }}
            className="cursor-pointer list-none rounded-md px-2 py-1.5 hover:bg-gray-500/8"
          >
            <Typography as="span" level="body4">
              Logout
            </Typography>
          </li>
        </div>
      </PopoverContent>
    </Popover>
  )
}
