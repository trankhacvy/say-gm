"use client"

import { Database } from "@/types/supabase.types"
import SayGMForm from "./say-gm-form"
import FeedItem from "./feed-item"
import { useFeed } from "@/hooks/use-feed"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

type FeedProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function Feed({ user }: FeedProps) {
  return (
    <div className="flex w-full flex-col gap-6 lg:basis-3/5">
      <SayGMForm user={user} />
      <DonationList id={String(user.id)} />
    </div>
  )
}

const DonationList = ({ id }: { id: string }) => {
  let { data: donations = [], isLoading } = useFeed(id)

  if (isLoading) {
    return Array.from({ length: 10 }).map((_, idx) => (
      <div className="w-full rounded-2xl bg-white p-5 shadow-card" key={idx}>
        <div className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/3 rounded-xl" />
            <Skeleton className="mt-2 h-3 w-1/4 rounded-xl" />
          </div>
        </div>
      </div>
    ))
  }

  if (donations.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-white p-5 shadow-card">
        <span className="text-7xl">👋</span>
        <Typography className="mt-4 font-semibold" color="primary">
          Become My First Supporter! 👋👋
        </Typography>
      </div>
    )
  }

  return donations.map((donation) => <FeedItem key={donation.id} donation={donation} />)
}
