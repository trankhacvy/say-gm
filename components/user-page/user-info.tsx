import Image from "next/image"
import { Database } from "@/types/supabase.types"
import { Typography } from "../ui/typography"
import { Button } from "../ui/button"
import { Share2Icon } from "lucide-react"

type UserInfoProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default async function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="flex w-full items-center justify-between gap-10">
      <div className="flex items-center gap-5">
        {/* <AspectRatio className="w-[160px] overflow-hidden"> */}
        <div className="relative aspect-square h-[160px] w-[160px] overflow-hidden rounded-full bg-gray-500/24">
          <Image
            // @ts-ignore
            alt={user.profile_metadata?.name}
            // @ts-ignore
            src={user.profile_metadata?.avatar ?? ""}
            fill
          />
        </div>
        {/* </AspectRatio> */}
        <div className="">
          <Typography as="h2" level="h6" className="mt-4 font-bold">
            {/* @ts-ignore */}
            {user.profile_metadata?.name}
          </Typography>
          <Typography as="span" level="body4" color="secondary" className="mt-2">
            @{user.domain_name}
          </Typography>
        </div>
      </div>
      <Button endDecorator={<Share2Icon />}>Share</Button>
    </div>
  )
}
