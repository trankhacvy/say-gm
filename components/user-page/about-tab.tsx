import { Database } from "@/types/supabase.types"
import { Typography } from "../ui/typography"
import Feed from "./feed"
import Membership from "./membership"

export function AboutTab({ user }: { user: Database["public"]["Tables"]["tbl_users"]["Row"] }) {
  return (
    <div className="-mx-3 mt-10 flex w-full flex-wrap">
      <div className="mb-6 w-full space-y-6 px-3 lg:mb-0 lg:w-2/5">
        <div className="w-full rounded-2xl bg-white p-6 shadow-card">
          <Typography as="h2" level="body2" className="font-bold">
            About me
          </Typography>
          <div className="mt-6 flex w-full flex-col gap-4">
            <Typography as="p" level="body4">
              {/* @ts-ignore */}
              {user.profile_metadata?.bio}
            </Typography>
          </div>
        </div>
        <Membership user={user} />
      </div>
      <Feed user={user} />
    </div>
  )
}
