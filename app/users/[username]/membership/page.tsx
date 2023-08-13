import { notFound } from "next/navigation"
import Supabase from "@/lib/supabase"
import Membership from "@/components/user-page/membership"
import { IS_PROD } from "@/utils/env"
import ComingSoon from "@/components/coming-soon"

export default async function MembershipPage({ params }: { params: { username: string } }) {
  if (IS_PROD) return <ComingSoon />

  const user = await Supabase.findUserUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="mt-10">
      <Membership user={user} />
    </div>
  )
}
