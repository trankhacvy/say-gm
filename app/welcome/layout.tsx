import { LandingHeader } from "@/components/layouts/landing-header"

interface WelcomeLayoutProps {
  children: React.ReactNode
}

export default async function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <div className="relative flex h-full flex-col">
      <LandingHeader />
      <main className="bg-image-blur relative flex flex-col items-center justify-center py-24">{children}</main>
    </div>
  )
}
