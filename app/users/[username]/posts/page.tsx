import { notFound } from "next/navigation"
import Supabase from "@/lib/supabase"
import { constructMetadata } from "@/utils/meta"
import Post from "../../../../components/user-page/post"

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
      <Post user={user} />
    </div>
  )
}
