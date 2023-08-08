import { UserPageHeader } from "@/components/layouts/user-page-header"

interface UserPageLayoutProps {
  children: React.ReactNode
}

export default async function UserPageLayout({ children }: UserPageLayoutProps) {
  return (
    <div className="h-full">
      <UserPageHeader />
      <main className="bg-blur relative">
        <div className="flex min-h-screen flex-col py-24">{children}</div>
      </main>
    </div>
  )
}
