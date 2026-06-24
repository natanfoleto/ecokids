import { Skeleton } from '@/components/ui/skeleton'

export function ShopLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      {/* Points Header Card Skeleton */}
      <div className="flex w-full flex-col gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <Skeleton className="h-6 w-44 rounded-lg" />

        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-2.5">
            <Skeleton className="mb-1.5 h-3.5 w-16 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-md" />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-100 bg-amber-50/50 p-2.5">
            <Skeleton className="mb-1.5 h-3.5 w-16 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-md" />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-50 bg-emerald-50/50 p-2.5">
            <Skeleton className="mb-1.5 h-3.5 w-16 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-md" />
          </div>
        </div>
      </div>

      {/* Shop Items Grid Skeleton */}
      <div className="xs:grid-cols-2 grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="col-span-1 flex flex-col gap-4 rounded-2xl border-2 border-emerald-100 bg-white p-4 shadow-sm"
          >
            <Skeleton className="h-44 w-full rounded-xl" />
            <div className="flex flex-1 flex-col items-center gap-2 text-center">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <div className="w-full space-y-1 pt-1">
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="mx-auto h-3 w-5/6 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
