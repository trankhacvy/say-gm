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
    <div className="relative bg-gray-500/5 px-4 py-20 md:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-screen-xl">
        <Typography as="h2" className="mb-10 text-center text-[2.5rem] font-bold md:mb-20 md:text-5xl lg:text-6xl">
          Created for Creators
        </Typography>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
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
        <Typography as="h3" level="h6" className="mt-4 overflow-hidden text-ellipsis font-bold">
          @{creator?.domain_name}
        </Typography>
      </div>
    </Link>
  )
}
