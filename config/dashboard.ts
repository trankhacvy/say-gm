import { Icons } from "@/components/icons"

interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

type SidebarNavItem = NavItemWithChildren

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[]
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "user",
      items: [],
    },
    {
      title: "Stores",
      href: "/dashboard/stores",
      icon: "store",
      items: [],
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
      items: [],
    },
    {
      title: "Purchases",
      href: "/dashboard/purchases",
      icon: "dollarSign",
      items: [],
    },
  ],
}
