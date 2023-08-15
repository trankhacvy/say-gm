import ComingSoon from "@/components/coming-soon"
import MyDrops from "@/components/drops/my-drops"
import { NewDropButton } from "@/components/drops/new-drop-dialog"
import { Typography } from "@/components/ui/typography"
import { IS_PROD } from "@/utils/env"

export default function DropsPage() {
  if (IS_PROD) return <ComingSoon />
  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <Typography as="h2" className="font-bold" level="h6">
          My Drops
        </Typography>
        <NewDropButton />
      </div>
      <MyDrops />
    </>
  )
}
