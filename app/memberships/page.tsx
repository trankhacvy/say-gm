import ComingSoon from "@/components/coming-soon"
import MembershipsTab from "@/components/memberships/memberships-tab"
import { Typography } from "@/components/ui/typography"
import { IS_PROD } from "@/utils/env"

export default async function MembershipsPage() {
  if (IS_PROD) return <ComingSoon />

  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="mb-6 flex items-center lg:mb-10">
        <Typography as="h4" level="h6" className="font-bold">
          Memberships
        </Typography>
      </div>
      <MembershipsTab />
    </div>
  )
}
