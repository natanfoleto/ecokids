import { Skeleton } from '@/components/ui/skeleton'

export function PointsLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      {/* Your Score Card Skeleton */}
      <div className="flex w-full flex-col gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <Skeleton className="h-6 w-36 rounded-lg" />

        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-emerald-50 bg-emerald-50/20 px-4 py-6">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="mt-2 h-10 w-20 rounded-md" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
          <div className="rounded-xl border border-emerald-50 bg-emerald-50/50 p-2.5">
            <Skeleton className="mx-auto mb-1 h-3 w-10 rounded-md" />
            <Skeleton className="mx-auto h-4 w-8 rounded-md" />
          </div>
          <div className="rounded-xl border border-emerald-50 bg-emerald-50/50 p-2.5">
            <Skeleton className="mx-auto mb-1 h-3 w-10 rounded-md" />
            <Skeleton className="mx-auto h-4 w-8 rounded-md" />
          </div>
          <div className="rounded-xl border border-emerald-50 bg-emerald-50/50 p-2.5">
            <Skeleton className="mx-auto mb-1 h-3 w-10 rounded-md" />
            <Skeleton className="mx-auto h-4 w-8 rounded-md" />
          </div>
        </div>
      </div>

      {/* History Card Skeleton */}
      <div className="w-full rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <Skeleton className="mb-4 h-6 w-44 rounded-lg" />

        <div className="flex flex-col">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-emerald-50 py-4 last:border-0"
            >
              <Skeleton className="h-4.5 w-24 rounded-md" />
              <Skeleton className="h-3.5 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
