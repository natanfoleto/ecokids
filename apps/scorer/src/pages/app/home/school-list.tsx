import { useQuery } from '@tanstack/react-query'
import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getSchools } from '@/http/schools/get-schools'

export function SchoolList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['schools'],
    queryFn: () => getSchools(),
  })

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-red-300/30 bg-white/15 p-6 text-white backdrop-blur-sm">
        <p className="font-medium">Erro ao carregar escolas.</p>
        <p className="text-sm text-emerald-100">Tente novamente mais tarde.</p>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-5">
      {isLoading ? (
        <>
          <Skeleton className="h-44 w-72 rounded-2xl bg-white/20" />
          <Skeleton className="h-44 w-72 rounded-2xl bg-white/20" />
          <Skeleton className="h-44 w-72 rounded-2xl bg-white/20" />
        </>
      ) : (
        data?.schools.map((school) => {
          return (
            <Link
              key={school.id}
              to={`/school/${school.slug}`}
              className="group"
            >
              <div className="flex w-72 flex-col items-center gap-4 rounded-2xl border border-white/30 bg-white/20 p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/30 hover:shadow-xl active:scale-95">
                <Avatar className="size-20 ring-4 ring-white/40">
                  {school.logoUrl && <AvatarImage src={school.logoUrl} />}
                  <AvatarFallback className="bg-emerald-700/60 text-white">
                    <Leaf className="size-8" />
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 text-center">
                  <h2 className="text-lg font-bold leading-tight text-white">
                    {school.name}
                  </h2>
                  {school.state && (
                    <p className="text-sm font-medium text-emerald-100">
                      {school.state}
                    </p>
                  )}
                </div>

                <div className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/20 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-white/30">
                  <Leaf className="size-4" />
                  Selecionar escola
                </div>
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}
