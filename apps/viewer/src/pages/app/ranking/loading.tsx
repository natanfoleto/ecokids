import { Skeleton } from '@/components/ui/skeleton'

export function RankingLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      {/* Filter Card Skeleton */}
      <div className="flex w-full flex-col gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <Skeleton className="h-6 w-52 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28 rounded-md" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Leaderboard Card Skeleton */}
      <div className="flex w-full flex-col gap-3 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <div className="flex items-center justify-between border-b border-emerald-50 pb-2">
          <Skeleton className="h-3.5 w-28 rounded-md" />
          <Skeleton className="h-3.5 w-16 rounded-md" />
        </div>

        <div className="flex flex-col gap-4 pt-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
