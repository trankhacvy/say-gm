"use client"

import Image from "next/image"
import { Typography } from "../ui/typography"
import { Database } from "@/types/supabase.types"
import truncate from "@/utils/truncate"
import dayjs from "dayjs"
import { getUserAvatar } from "@/utils/common"

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
          src={getUserAvatar(donation.donator ?? "A")}
          className="overflow-hidden rounded-full"
        />
        <div className="flex-1">
          <a href={`https://translator.shyft.to/address/${donation.donator}`} target="_blank">
            <Typography level="body4" className="font-semibold">
              {truncate(donation.donator ?? "", 8, true)}
            </Typography>
          </a>
          <Typography as="p" level="body5" className="mt-1" color="secondary">
            {dayjs(donation.created_at).format("DD MMM YYYY")}
          </Typography>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Typography level="h6" className="font-semibold">
          {Array.from({ length: donation.num_of_gm ?? 1 })
            .map(() => "👋")
            .join(" ")}
        </Typography>
        <Typography as="p" level="body4" color="secondary">
          {donation.message}
        </Typography>
      </div>
    </div>
  )
}
