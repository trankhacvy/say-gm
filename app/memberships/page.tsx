import MembershipsTab from "@/components/memberships/memberships-tab"
import { Typography } from "@/components/ui/typography"

export default async function MembershipsPage() {
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
