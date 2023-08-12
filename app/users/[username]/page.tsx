import { notFound } from "next/navigation"
import { Typography } from "@/components/ui/typography"
import Feed from "@/components/user-page/feed"
import UserInfo from "@/components/user-page/user-info"
import Supabase from "@/lib/supabase"
import { constructMetadata } from "@/utils/meta"
import Membership from "@/components/user-page/membership"

export async function generateMetadata({ params }: { params: { username: string } }) {
  const user = await Supabase.findUserUsername(params.username)
  if (!user) {
    return constructMetadata({
      title: "Page not found",
    })
  }

  // @ts-ignore
  const title = `${user?.profile_metadata?.name ?? user?.domain_name}`
  const description = `Say gm to ${title}`

  return constructMetadata({
    title,
    description,
  })
}

export default async function UserPage({ params }: { params: { username: string } }) {
  const user = await Supabase.findUserUsername(params.username)

  if (!user) {
    return notFound()
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-10">
      <div className="flex w-full flex-col items-center">
        <UserInfo user={user} />
      </div>

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
    </div>
  )
}
