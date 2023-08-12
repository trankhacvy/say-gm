"use client"

import { Typography } from "../ui/typography"
import { Database } from "@/types/supabase.types"
import { useMembershipTiers } from "@/hooks/use-membership-tiers"
import { AspectRatio } from "../ui/aspect-ratio"
import Image from "next/image"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

type MembershipProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function Membership({ user }: MembershipProps) {
  const { data: membershipTiers, isLoading } = useMembershipTiers(String(user.id))

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-card">
      <Typography as="h2" level="body2" className="font-bold">
        Membership
      </Typography>
      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="w-full rounded-2xl bg-gray-200 p-4">
              <AspectRatio className="rounded-2xl">
                <Skeleton className="h-full w-full" />
              </AspectRatio>
              <div className="flex flex-col gap-3 py-3">
                <Skeleton className="h-4 w-2/3 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {membershipTiers?.length === 0 ? (
            <div className="pt-6">
              <Typography color="secondary" className="text-center font-semibold">
                No membership
              </Typography>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4">
              {membershipTiers?.map((item) => (
                <MembershipCard key={item.id} tier={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const MembershipCard = ({ tier }: { tier: Database["public"]["Tables"]["tbl_memberships_tiers"]["Row"] }) => {
  return (
    <div className="w-full rounded-2xl bg-gray-200 p-4">
      <AspectRatio>
        <Image className="rounded-xl" src={tier.image ?? ""} alt={tier.name ?? ""} fill />
      </AspectRatio>
      <div className="flex flex-col gap-3 py-5">
        <Typography className="font-bold">{tier.name}</Typography>
        <div className="flex">
          <Typography color="primary" className="font-bold">
            $
          </Typography>
          <Typography color="primary" level="h4" className="font-bold">
            {tier.price}
          </Typography>
        </div>
        <Typography level="body4" color="secondary">
          {tier.benefit}
        </Typography>
      </div>
      <Button fullWidth color="primary">
        Get
      </Button>
    </div>
  )
}
