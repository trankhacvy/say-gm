import { notFound } from "next/navigation"
import Supabase from "@/lib/supabase"
import Post from "../../../../components/user-page/post"

export default async function PostPage({ params }: { params: { username: string } }) {
  const creator = await Supabase.findUserUsername(params.username)

  if (!creator) {
    notFound()
  }

  return (
    <div className="mt-10 flex w-full flex-col gap-4 md:gap-6 lg:flex-row lg:gap-10">
      <Post creator={creator} />
    </div>
  )
}
