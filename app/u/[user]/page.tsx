import { Typography } from "@/components/ui/typography"
import PostCard from "@/components/user-page/post"
import Image from "next/image"

export default function UserPage() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col items-center">
        <Image
          alt="profile"
          src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg"
          width={120}
          height={120}
          className="rounded-full"
        />
        <Typography as="h2" level="h6" className="mt-5 font-bold">
          Vincenzo
        </Typography>
        <div className="-mx-3 mt-10 flex h-40 w-full flex-wrap">
          <div className="w-full lg:w-1/3 px-3 mb-6 lg:mb-0">
            <div className="w-full rounded-2xl bg-white p-6 shadow-card">
              <Typography as="h2" level="body2" className="font-bold">
                About me
              </Typography>
              <div className="mt-6 flex flex-col gap-4">
                <Typography as="p" level="body4">
                  Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..
                </Typography>
              </div>
            </div>
          </div>

          <div className="flex w-full lg:w-2/3 flex-col gap-6 px-3">
            <PostCard />
            <PostCard />
            <PostCard />
          </div>
        </div>
      </div>
    </div>
  )
}
