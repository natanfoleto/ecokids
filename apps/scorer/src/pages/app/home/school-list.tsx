import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getSchools } from '@/http/schools/get-schools'

export function SchoolList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['schools'],
    queryFn: () => getSchools(),
  })

  if (isError) {
    return (
      <p className="text-red-500">
        Erro ao carregar escolas. Tente novamente mais tarde.
      </p>
    )
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4">
      {isLoading ? (
        <>
          <Skeleton className="h-40 w-full rounded-b-lg" />
          <Skeleton className="h-40 w-full rounded-b-lg" />
          <Skeleton className="h-40 w-full rounded-b-lg" />
        </>
      ) : (
        data?.schools.map((school) => {
          return (
            <Link
              key={school.id}
              to={`/school/${school.slug}`}
              className="min-w-1/4 h-full"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-medium">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <Avatar className="size-16">
                        {school.logoUrl && <AvatarImage src={school.logoUrl} />}
                        <AvatarFallback />
                      </Avatar>

                      {school.name}
                    </div>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 leading-relaxed">
                    {school.state}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })
      )}
    </div>
  )
}
