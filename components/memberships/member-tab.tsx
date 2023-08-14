"use client"

import { useGetMembershipsByCreator } from "@/hooks/use-memberships"
import { useSession } from "next-auth/react"
import { Typography } from "../ui/typography"
import dayjs from "dayjs"
import { Skeleton } from "../ui/skeleton"

export default function MemberTab() {
  const { data: session } = useSession()
  const { data: members, isLoading } = useGetMembershipsByCreator(String(session?.user.id))

  return (
    <div className="space-y-5 pb-8 pt-4">
      {isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-card">
            <Skeleton className="h-5 w-1/3 rounded-xl" />
            <Skeleton className="h-4 w-6 rounded-xl" />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-card">
            <Skeleton className="h-5 w-1/3 rounded-xl" />
            <Skeleton className="h-4 w-6 rounded-xl" />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-card">
            <Skeleton className="h-5 w-1/3 rounded-xl" />
            <Skeleton className="h-4 w-6 rounded-xl" />
          </div>
        </div>
      )}

      {members?.map((member) => (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-card" key={member.id}>
          <Typography level="body4" className="font-bold">
            {member.member}
          </Typography>
          <div className="flex flex-col gap-2">
            <Typography level="body4" className="font-bold" color="success">
              {/* @ts-ignore */}
              {member.dev_tbl_memberships_tiers?.name}
            </Typography>
            <Typography level="body5" color="secondary">
              {dayjs(member.created_at).format("DD/MM/YYYY")}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  )
}
