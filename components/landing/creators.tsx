"use client"

import supabase from "@/lib/supabase"
import useSWR from "swr"
import { Typography } from "../ui/typography"
import { Database } from "@/types/supabase.types"
import { AspectRatio } from "../ui/aspect-ratio"
import Image from "next/image"
import { getUserAvatar } from "@/utils/common"
import Link from "next/link"

export default function Creators() {
  const { data: users } = useSWR("explore-creators", () => supabase.findAllUser())

  return (
    <div className="relative bg-gray-500/5 py-32">
      <div className="mx-auto max-w-screen-xl">
        <Typography as="h2" level="h3" className="mb-20 text-center font-bold">
          Created for Creators
        </Typography>
        <div className="grid grid-cols-4 gap-8">
          {users?.map((user) => (
            <CreatorCard creator={user} />
          ))}
        </div>
      </div>
    </div>
  )
}

const CreatorCard = ({ creator }: { creator: Database["public"]["Tables"]["tbl_users"]["Row"] }) => {
  return (
    <Link href={`/users/${creator.domain_name}`}>
      <div className="duration-400 w-full scale-100 rounded-xl bg-white p-2 shadow-card transition-transform ease-in hover:z-50 hover:scale-110">
        <AspectRatio className="overflow-hidden rounded-xl bg-gray-500/24">
          {/* @ts-ignore */}
          <Image
            // @ts-ignore
            src={creator?.profile_metadata?.avatar ?? getUserAvatar(creator?.wallet ?? "A")}
            // @ts-ignore
            alt={creator?.domain_name}
            fill
          />
        </AspectRatio>
        <Typography as="h3" level="h6" className="mt-4 font-bold">
          @{creator?.domain_name}
        </Typography>
      </div>
    </Link>
  )
}
