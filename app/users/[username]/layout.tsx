import { UserPageHeader } from "@/components/layouts/user-page-header"
import UserInfo from "@/components/user-page/user-info"
import UserTabs from "@/components/user-page/user-tabs"
import supabase from "@/lib/supabase"
import { notFound } from "next/navigation"

interface UserPageLayoutProps {
  children: React.ReactNode
  params: { username: string }
}

export default async function UserPageLayout({ children, params }: UserPageLayoutProps) {
  const user = await supabase.findUserUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="h-full">
      <UserPageHeader />
      <main className="bg-blur relative">
        <div className="flex min-h-screen flex-col py-24">
          <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-10">
            <UserInfo user={user} />
            <UserTabs user={user} />
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
