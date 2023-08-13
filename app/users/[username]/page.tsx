import { notFound } from "next/navigation"
import { Typography } from "@/components/ui/typography"
import Feed from "@/components/user-page/feed"
import Supabase from "@/lib/supabase"
import { constructMetadata } from "@/utils/meta"

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
    image: `/api/og?username=${user.domain_name}`,
  })
}

export default async function UserPage({ params }: { params: { username: string } }) {
  const user = await Supabase.findUserUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="mt-10 flex w-full flex-col gap-4 md:gap-6 lg:flex-row lg:gap-10">
      <div className="w-full space-y-6 lg:mb-0 lg:basis-2/5">
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
      </div>
      <Feed user={user} />
    </div>
  )
}
