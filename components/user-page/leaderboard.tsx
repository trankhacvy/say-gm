"use client"

import { Database } from "@/types/supabase.types"
import { Typography } from "../ui/typography"
import { useGrouppedDonations } from "@/hooks/use-donations"
import Image from "next/image"
import { getUserAvatar } from "@/utils/common"
import truncate from "@/utils/truncate"
import { MedalIcon } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { getTxUrl } from "@/utils/explorer"

type LeaderboardProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export function Leaderboard({ user }: LeaderboardProps) {
  const { data: donations = [], isLoading } = useGrouppedDonations(String(user.id))

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-card">
      <Typography as="h2" level="body2" className="font-bold">
        Top supporters
      </Typography>
      <div className="mt-6 flex w-full flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => <ItemSkeleton key={idx} />)
        ) : (
          <>
            {donations.length === 0 ? (
              <Typography color="secondary">Become My First Supporter! 👋👋</Typography>
            ) : (
              donations.map((item, idx) => (
                <Item
                  key={item.donator}
                  donator={item.donator ?? ""}
                  numOfDonation={item.count_donation ?? 0}
                  order={idx + 1}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}

const Item = ({ donator, numOfDonation, order }: { donator: string; numOfDonation: number; order: number }) => {
  return (
    <div className="flex w-full items-center gap-4">
      <div className="relative h-10 w-10 overflow-hidden rounded-full">
        <Image src={getUserAvatar(donator)} fill alt={donator} className="object-cover" />
      </div>
      <div className="flex-1">
        <a href={getTxUrl(donator, "address")} target="_blank">
          <Typography as="p" level="body4" className="font-semibold">
            {truncate(donator, 24, true)}
          </Typography>
        </a>
        <Typography level="body4" color="error" className="font-bold">
          {numOfDonation} 👋
        </Typography>
      </div>
      {order === 1 && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-700/8 p-1 text-success-700">
          <MedalIcon />
        </span>
      )}
      {order === 2 && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-info-700/8 p-1 text-info-700">
          <MedalIcon />
        </span>
      )}
      {order === 3 && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-error-700/8 p-1 text-error-700">
          <MedalIcon />
        </span>
      )}
    </div>
  )
}

const ItemSkeleton = () => {
  return (
    <div className="flex w-full items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-1/2" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  )
}
