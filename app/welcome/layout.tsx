import { LandingHeader } from "@/components/layouts/landing-header"

interface WelcomeLayoutProps {
  children: React.ReactNode
}

export default async function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <div className="relative flex h-full flex-col">
      <LandingHeader />
      <main className="bg-image-blur relative flex flex-col items-center justify-center px-4 py-20 md:px-6 lg:px-10 lg:py-28">{children}</main>
    </div>
  )
}
