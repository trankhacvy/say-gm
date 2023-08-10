"use client"

import { Typography } from "../ui/typography"
import { MoreVerticalIcon } from "lucide-react"
import { Database } from "@/types/supabase.types"
import { AspectRatio } from "../ui/aspect-ratio"
import Image from "next/image"
import { formatCurrency } from "@/utils/currency"
import { IconButton } from "../ui/icon-button"

type TierItemProps = {
  tier: Database["public"]["Tables"]["tbl_memberships"]["Row"]
}

export default function TierItem({ tier }: TierItemProps) {
  return (
    <div className="flex items-start gap-4 overflow-hidden rounded-2xl border border-gray-500/16">
      <div className="w-[120px]">
        <AspectRatio>
          <Image src={tier.image ?? ""} fill alt={tier.name ?? ""} />
        </AspectRatio>
      </div>
      <div className="flex-1 p-4">
        <Typography as="h4" level="body2" className="font-semibold">
          {tier.name}
        </Typography>
        <Typography as="p" level="body4" color="secondary">
          {tier.description}
        </Typography>
        <Typography as="p" level="body4" className="mt-4 font-bold" color="primary">
          Price: {formatCurrency(tier.price ?? 0)}
        </Typography>
      </div>
      <IconButton size="sm" className="p-3">
        <MoreVerticalIcon />
      </IconButton>
    </div>
  )
}
