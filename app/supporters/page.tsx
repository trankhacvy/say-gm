import ComingSoon from "@/components/coming-soon"
import MySupporters from "@/components/supporters/my-supporters"
import { Typography } from "@/components/ui/typography"
import { IS_PROD } from "@/utils/env"

export default function Supporter() {
  if (IS_PROD) return <ComingSoon />
  return (
    <>
      <Typography as="h2" className="mb-10 font-bold" level="h6">
        My supporters
      </Typography>
      <MySupporters />
    </>
  )
}
