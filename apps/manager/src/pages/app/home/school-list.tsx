import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowRight, School } from 'lucide-react'
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

  const schools = data?.schools ?? []

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        <>
          <Skeleton className="h-36 w-full rounded-b-lg" />
          <Skeleton className="h-36 w-full rounded-b-lg" />
        </>
      ) : schools.length === 0 ? (
        <div className="border-border bg-card/30 col-span-full flex h-60 w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mb-4 rounded-full border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
            <School className="size-8" />
          </div>
          <h3 className="text-lg font-semibold">Nenhuma escola encontrada</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm font-light">
            {`Você não possui nenhuma escola vinculada. Crie uma nova escola
            clicando no botão "Criar escola" acima. `}
          </p>
        </div>
      ) : (
        schools.map((school) => {
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
                  <Link
                    to={`/school/${school.slug}`}
                    className="flex items-center gap-1.5"
                  >
                    Ver <ArrowRight className="size-3" />
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
