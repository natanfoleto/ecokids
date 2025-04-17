import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
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
    <div className="grid grid-cols-4 gap-4">
      {isLoading ? (
        <>
          <Skeleton className="h-36 w-full rounded-b-lg" />
          <Skeleton className="h-36 w-full rounded-b-lg" />
        </>
      ) : (
        data?.schools.map((school) => {
          return (
            <Card key={school.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-medium">
                  {school.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 leading-relaxed">
                  {school.state}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex items-center gap-1.5">
                <Avatar className="mr-0.5 size-5">
                  {school.logoUrl && <AvatarImage src={school.logoUrl} />}
                  <AvatarFallback />
                </Avatar>

                <span className="text-muted-foreground text-xs">
                  {dayjs(school.createdAt).fromNow()}
                </span>

                <Button className="ml-auto" size="sm" variant="outline" asChild>
                  <Link to={`/school/${school.slug}`}>
                    Ver <ArrowRight className="ml-2 size-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })
      )}
    </div>
  )
}
