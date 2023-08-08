import { Typography } from "@/components/ui/typography"
import PostCard from "@/components/user-page/post"
import Supabase from "@/lib/supabase"
import Image from "next/image"

export default async function UserPage({ params }: { params: { user: string } }) {
  const user = await Supabase.findUserUsername(params.user)

  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="flex w-full flex-col items-center">
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

          <div className="flex w-full flex-col gap-6 px-3 lg:w-2/3">
            <PostCard />
            <PostCard />
            <PostCard />
          </div>
        </div>
      </div>
    </div>
  )
}
