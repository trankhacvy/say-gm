"use client"

import { HeartHandshakeIcon, HomeIcon, PartyPopperIcon, SettingsIcon, StickyNoteIcon, StoreIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Typography } from "@/components/ui/typography"
import { Routes } from "@/config/routes"
import { cn } from "@/utils/cn"
import GmLogo from "../gm-logo"
import { Sheet, SheetTrigger, SheetContent, SheetHeader } from "../ui/sheet"

const NavItems = [
  {
    text: "Home",
    href: Routes.DASHBOARD,
    icon: <HomeIcon />,
  },
  {
    text: "Supporters",
    href: Routes.SUPPORTERS,
    icon: <HeartHandshakeIcon />,
  },
  {
    text: "Memberships",
    href: Routes.MEMBERSHIPS,
    icon: <PartyPopperIcon />,
  },
  {
    text: "Drops",
    href: Routes.DROPS,
    icon: <PartyPopperIcon />,
  },
  {
    text: "Posts",
    href: Routes.POSTS,
    icon: <StickyNoteIcon />,
  },
  {
    text: "Shop",
    href: Routes.SHOP,
    icon: <StoreIcon />,
  },
  {
    text: "Settings",
    href: Routes.SETTINGS,
    icon: <SettingsIcon />,
  },
]

export const DashboardNav = () => {
  const pathname = usePathname() ?? ""

  return (
    <nav className="hidden w-[280px] shrink-0 lg:block">
      <div className="fixed left-0 top-0 z-0 h-full w-[280px] overflow-y-auto border-r border-dashed border-r-gray-500/24">
        <div className="mb-4 px-5 py-6">
          <GmLogo className="text-7xl" href={Routes.DASHBOARD} />
        </div>
        <div className="flex h-96 flex-col">
          <ul className="relative px-4">
            {NavItems.map((item) => (
              <NavItem
                key={item.text}
                text={item.text}
                href={item.href}
                selected={item.href === "/" ? pathname === item.href : pathname.startsWith(item.href)}
                icon={item.icon}
              />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

type NavItemProps = {
  text: string
  href: string
  selected?: boolean
  icon?: React.ReactNode
}

const NavItem = ({ text, href, selected, icon }: NavItemProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "mb-2 flex h-12 cursor-pointer select-none items-center justify-start gap-2 rounded-lg py-2 pl-3 pr-4",
          { "bg-primary-500/8": selected },
          { "hover:bg-gray-500/8": !selected }
        )}
      >
        <span
          className={cn("h-6 w-6 rounded-full", {
            "text-primary-500": selected,
            "text-gray-600": !selected,
          })}
        >
          {icon}
        </span>
        <Typography
          level="body4"
          className={cn("font-semibold", {
            "text-primary-500": selected,
            "text-gray-600": !selected,
          })}
        >
          {text}
        </Typography>
      </div>
    </Link>
  )
}

export const DashboardNavMobile = ({ trigger }: { trigger: React.ReactNode }) => {
  const pathname = usePathname() ?? ""

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent position="left" className="w-full max-w-sm">
        <SheetHeader>
          <GmLogo className="text-7xl" href={Routes.DASHBOARD} />
        </SheetHeader>
        <div className="flex flex-col gap-4 py-10">
          {NavItems.map((item) => (
            <NavItem
              key={item.text}
              text={item.text}
              href={item.href}
              selected={item.href === "/" ? pathname === item.href : pathname.startsWith(item.href)}
              icon={item.icon}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
