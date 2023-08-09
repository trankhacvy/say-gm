import Image from "next/image"
import { Database } from "@/types/supabase.types"
import { Typography } from "../ui/typography"

type UserInfoProps = {
  user: Database["public"]["Tables"]["tbl_users"]["Row"]
}

export default async function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="text-center">
      <Image
        // @ts-ignore
        alt={user.profile_metadata?.name}
        // @ts-ignore
        src={user.profile_metadata?.avatar ?? ""}
        width={120}
        height={120}
        className="overflow-hidden rounded-full"
      />
      <Typography as="h2" level="h6" className="mt-4 font-bold">
        {/* @ts-ignore */}
        {user.profile_metadata?.name}
      </Typography>
      <Typography as="span" level="body4" color="secondary" className="mt-2">
        @{user.domain_name}
      </Typography>
    </div>
  )
}
