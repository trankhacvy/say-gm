import { LandingHeader } from "@/components/layouts/landing-header"

interface LobbyLayoutProps {
  children: React.ReactNode
}

export default async function LobbyLayout({ children }: LobbyLayoutProps) {
  return (
    <div className="relative flex h-full flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
