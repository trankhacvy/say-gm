"use client"

import Image from "next/image"
import { Typography } from "../ui/typography"
import { Database } from "@/types/supabase.types"
import truncate from "@/utils/truncate"
import dayjs from "dayjs"
import { getUserAvatar } from "@/utils/common"
import Link from "next/link"
import { getTxUrl } from "@/utils/explorer"

type FeedItemProps = {
  donation: Database["public"]["Views"]["dev_user_feeds"]["Row"]
}

export default function FeedItem({ donation }: FeedItemProps) {
  const hasUsername = !!donation.donator_username
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-card">
      <div className="flex gap-4">
        <Image
          width={48}
          height={48}
          alt="profile"
          src={donation.donator_avatar ?? getUserAvatar(donation.donator ?? "A")}
          className="overflow-hidden rounded-full"
        />
        <div className="flex-1">
          {hasUsername ? (
            <Link href={`/users/${donation.donator_username}`}>
              <Typography level="body4" className="font-semibold">
                @{donation.donator_username}
              </Typography>
            </Link>
          ) : (
            <a href={getTxUrl(donation.donator ?? "", "address")} target="_blank">
              <Typography level="body4" className="font-semibold">
                {truncate(donation.donator ?? "", 8, true)}
              </Typography>
            </a>
          )}
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
