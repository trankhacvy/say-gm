import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import Feed from "@/components/user-page/feed"
import UserInfo from "@/components/user-page/user-info"
import Supabase from "@/lib/supabase"

export default async function UserPage({ params }: { params: { username: string } }) {
  const user = await Supabase.findUserUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="flex w-full flex-col items-center">
        <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
          <UserInfo user={user} />
        </Suspense>
        <div className="-mx-3 mt-10 flex w-full flex-wrap">
          <div className="mb-6 w-full px-3 lg:mb-0 lg:w-1/3">
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
          <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
            <Feed user={user} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
