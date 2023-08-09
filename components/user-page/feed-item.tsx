"use client"

import Image from "next/image"
import { Typography } from "../ui/typography"
import { Database } from "@/types/supabase.types"
import truncate from "@/utils/truncate"
import dayjs from "dayjs"

type FeedItemProps = {
  donation: Database["public"]["Tables"]["tbl_donation"]["Row"]
}

export default function FeedItem({ donation }: FeedItemProps) {
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-card">
      <div className="flex gap-4">
        <Image
          width={48}
          height={48}
          alt="profile"
          src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg"
          className="overflow-hidden rounded-full"
        />
        <div className="flex-1">
          <Typography level="body4" className="font-semibold">
            {donation.name ?? truncate(donation.donator ?? "", 16, true)}
          </Typography>
          <Typography as="p" level="body5" className="mt-1" color="secondary">
            {dayjs(donation.created_at).format("DD MMM YYYY")}
          </Typography>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Typography level="body4" className="font-semibold">
          Say gm {donation.num_of_gm === 1 ? "one time" : `${donation.num_of_gm} times`} 👋 👋
        </Typography>
        <Typography as="p" level="body4" color="secondary">
          {donation.message}
        </Typography>
      </div>
    </div>
  )
}
