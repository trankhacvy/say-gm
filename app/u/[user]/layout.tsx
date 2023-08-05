import { UserPageHeader } from "@/components/layouts/user-page-header"

interface UserPageLayoutProps {
  children: React.ReactNode
}

export default async function UserPageLayout({ children }: UserPageLayoutProps) {
  return (
    <div className="bg-image-blur relative h-full">
      <UserPageHeader />
      <main className="flex min-h-screen flex-col py-24">{children}</main>
    </div>
  )
}
