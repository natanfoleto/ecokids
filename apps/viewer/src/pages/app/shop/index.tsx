import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'

import { LoadingPage } from '@/components/loading-page'
import { useAuth } from '@/contexts/auth'
import { useMetadata } from '@/hooks/use-metadata'
import { getSchoolShop } from '@/http/viewers/get-school-shop'

import { Item } from './item'

export function Shop() {
  useMetadata('Ecokids - Shop')

  const { student } = useAuth()

  const schoolId = student?.school.id

  const { data, isLoading } = useQuery({
    queryKey: ['school', 'shop', schoolId],
    queryFn: () =>
      getSchoolShop({
        params: {
          schoolId: schoolId as string,
        },
      }),
    enabled: !!schoolId,
  })

  if (isLoading) return <LoadingPage message="Carregando recompensas da loja" />

  const itens = data?.itens
  const activeSeason = data?.activeSeason

  const isSeasonClosed = !activeSeason

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      {isSeasonClosed && (
        <div className="flex w-full items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <div className="text-sm">
            <h4 className="font-semibold">Temporada de trocas fechada</h4>
            <p className="opacity-90">
              A administração da escola fechou a temporada de trocas. Você pode visualizar os prêmios, mas não pode solicitar novos resgates no momento.
            </p>
          </div>
        </div>
      )}

      <div className="bg-muted flex w-full flex-col gap-4 rounded-xl border-t-4 border-emerald-400 p-4">
        <h1 className="font-semibold">Prêmios para resgate</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2 border-t border-border">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Total Acumulado</span>
            <span className="font-semibold text-base">{student?.totalPoints}</span>
          </div>
          <div className="flex flex-col gap-1 border-y sm:border-y-0 sm:border-x border-border py-2 sm:py-0 sm:px-4">
            <span className="text-muted-foreground text-xs">Pontos Reservados</span>
            <span className="font-semibold text-base text-amber-500">{student?.reservedPoints}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Disponível para Resgate</span>
            <span className="font-semibold text-base text-emerald-500">{student?.availablePoints}</span>
          </div>
        </div>
      </div>

      <div className="xs:grid-cols-2 grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {student &&
          itens?.map((item) => (
            <Item
              key={item.id}
              item={item}
              availablePoints={student.availablePoints}
              isSeasonClosed={isSeasonClosed}
            />
          ))}
      </div>
    </div>
  )
}
