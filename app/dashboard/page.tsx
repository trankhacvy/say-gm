import ComingSoon from "@/components/coming-soon"
import DashboardStatsGrid from "@/components/dashboard/DashboardStatsGrid"
import MembershipPieChart from "@/components/dashboard/MembershipPieChart"
import PopularItems from "@/components/dashboard/PopularItems"
import RevenueChart from "@/components/dashboard/RevenueChart"
import { IS_PROD } from "@/utils/env"

export default function DashboardPage() {
  if (IS_PROD) return <ComingSoon />

  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="flex flex-col gap-4">
        <DashboardStatsGrid />
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          {/* <div className="overflow-x-auto"> */}
          <RevenueChart />
          {/* </div> */}
          <MembershipPieChart />
        </div>
        <div className="w-full">
          <PopularItems />
        </div>
      </div>
    </div>
  )
}
