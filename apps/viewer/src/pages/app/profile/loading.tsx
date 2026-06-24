import { Skeleton } from '@/components/ui/skeleton'

export function ProfileLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-4">
      {/* Student Badge Skeleton */}
      <div className="flex w-full flex-col items-center gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-6 text-center shadow-sm shadow-emerald-50">
        <Skeleton className="size-24 rounded-full" />
        <div className="flex flex-col items-center gap-1.5">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-3.5 w-44 rounded-md" />
        </div>
      </div>

      {/* Student Metadata Skeleton */}
      <div className="w-full space-y-4">
        <div className="w-full space-y-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 text-xs font-semibold text-gray-700 shadow-sm shadow-emerald-50">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-14 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  )
}
