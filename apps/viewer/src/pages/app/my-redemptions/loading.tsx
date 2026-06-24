import { Skeleton } from '@/components/ui/skeleton'

export function MyRedemptionsLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-6 p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="h-3.5 w-64 rounded-md" />
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>

      {/* Redemption List Skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 rounded-2xl border-2 border-emerald-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4.5 w-40 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
              <Skeleton className="h-5.5 w-20 rounded-full" />
            </div>

            {idx === 0 && (
              <div className="flex items-center justify-between gap-4 border-t border-emerald-50 pt-3">
                <Skeleton className="h-3.5 w-1/2 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
