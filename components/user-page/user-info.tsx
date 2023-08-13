import Image from "next/image"
import { Database } from "@/types/supabase.types"
import { Typography } from "../ui/typography"
import ShareButton from "./share-button"

type UserInfoProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <div className="relative aspect-square h-[80px] w-[80px] overflow-hidden rounded-full bg-gray-500/24 md:h-[160px] md:w-[160px]">
          <Image
            // @ts-ignore
            alt={user.profile_metadata?.name}
            // @ts-ignore
            src={user.profile_metadata?.avatar ?? ""}
            fill
          />
        </div>
        <div>
          <Typography as="h2" className="text-base font-bold md:text-xl lg:text-2xl">
            {/* @ts-ignore */}
            {user.profile_metadata?.name}
          </Typography>
          <Typography as="span" level="body4" color="secondary" className="mt-2">
            @{user.domain_name}
          </Typography>
        </div>
      </div>
      <ShareButton user={user} />
    </div>
  )
}
