"use client"

import { useMembershipTiers } from "@/hooks/use-membership-tiers"
import { useSession } from "next-auth/react"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"
import { Button } from "../ui/button"
import { PlusIcon } from "lucide-react"
import { NewTierDialog } from "./new-tier-dialog"
import TierItem from "./tier-item"
import { useState } from "react"

export default function SetupTab() {
  const { data: session } = useSession()
  const { data: tiers = [], isLoading, mutate } = useMembershipTiers(String(session?.user.id))
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-3 px-4 py-6">
        <Skeleton className="h-5 w-1/2 rounded-xl" />
        <Skeleton className="h-5 w-1/2 rounded-xl" />
        <Skeleton className="h-5 w-1/2 rounded-xl" />
      </div>
    )
  }

  if (tiers?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-10">
        <Typography color="secondary" className="font-semibold">
          No tier
        </Typography>
        <NewTierDialog onSuccess={mutate} trigger={<Button endDecorator={<PlusIcon />}>New Tier</Button>} />
      </div>
    )
  }

  return (
    <div className="space-y-5 px-4 pb-8 pt-4">
      <div className="flex justify-end">
        <NewTierDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={mutate}
          trigger={<Button endDecorator={<PlusIcon />}>New Tier</Button>}
        />
      </div>
      {tiers?.map((tier) => (
        <TierItem key={tier.id} tier={tier} />
      ))}
    </div>
  )
}
