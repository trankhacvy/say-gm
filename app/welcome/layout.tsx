interface WelcomeLayoutProps {
  children: React.ReactNode
}

export default async function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <div className="bg-image-blur relative flex min-h-screen flex-col items-center justify-center py-24">
      {children}
    </div>
  )
}
