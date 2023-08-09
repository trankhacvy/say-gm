"use client"

import { Database } from "@/types/supabase.types"
import SayGMForm from "./say-gm-form"
import FeedItem from "./feed-item"
import { useFeed } from "@/hooks/use-feed"

type FeedProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default async function Feed({ user }: FeedProps) {
  const { data: donations = [] } = useFeed(String(user.id))

  return (
    <div className="flex w-full flex-col gap-6 px-3 lg:w-2/3">
      <SayGMForm user={user} />

      {donations.map((donation) => (
        <FeedItem key={donation.id} donation={donation} />
      ))}
    </div>
  )
}
