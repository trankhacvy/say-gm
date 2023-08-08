import Image from "next/image"
import { Typography } from "@/components/ui/typography"
import PostCard from "@/components/user-page/post"
import Supabase from "@/lib/supabase"

export default async function UserPage({ params }: { params: { user: string } }) {
  // const user = await Supabase.findUserUsername(params.user)

  return (
    <div className="mx-auto w-full max-w-screen-xl">
      dashboard
    </div>
  )
}
