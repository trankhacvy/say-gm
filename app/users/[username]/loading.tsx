import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl">
      <div className="flex w-full flex-col items-center gap-2">
        <Skeleton className="h-[120px] w-[120px] rounded-full" />
        <Skeleton className="h-5 w-[120px] rounded-xl" />
        <Skeleton className="h-4 w-24 rounded-xl" />
      </div>

      <div className="-mx-3 mt-10 flex w-full flex-wrap">
        <div className="mb-6 w-full px-3 lg:mb-0 lg:w-1/3">
          <div className="w-full rounded-2xl bg-white p-6 shadow-card">
            <Skeleton className="h-5 w-1/3 rounded-xl" />
            <Skeleton className="mt-6 h-4 w-full rounded-xl" />
            <Skeleton className="mt-1 h-4 w-2/3 rounded-xl" />
            <Skeleton className="mt-2 h-4 w-1/3 rounded-xl" />
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 px-3 lg:w-2/3">
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-1/3 rounded-xl" />
                <Skeleton className="mt-1 h-4 w-1/4 rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-4 w-full rounded-xl" />
            <Skeleton className="h-4 w-2/3 rounded-xl" />
            <Skeleton className="h-4 w-1/3 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
