import { notFound } from "next/navigation"
import Supabase from "@/lib/supabase"
import { IS_PROD } from "@/utils/env"
import ComingSoon from "@/components/coming-soon"
import Drops from "@/components/user-page/drops"

export default async function DropsPage({ params }: { params: { username: string } }) {
  if (IS_PROD) return <ComingSoon />

  const user = await Supabase.findUserUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="mt-10">
      <Drops user={user} />
    </div>
  )
}
