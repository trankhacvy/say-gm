import ComingSoon from "@/components/coming-soon"
import { IS_PROD } from "@/utils/env"

export default async function Supporter() {
  if (IS_PROD) return <ComingSoon />

  return <div className="mx-auto w-full max-w-screen-xl">supperter</div>
}
