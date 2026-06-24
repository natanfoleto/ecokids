import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'

import { useAuth } from '@/contexts/auth'
import { useMetadata } from '@/hooks/use-metadata'
import { getSchoolShop } from '@/http/viewers/get-school-shop'

import { Item } from './item'
import { ShopLoading } from './loading'

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

  if (isLoading) return <ShopLoading />

  const itens = data?.itens
  const activeSeason = data?.activeSeason

  const isSeasonClosed = !activeSeason

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      {isSeasonClosed && (
        <div className="border-destructive/20 bg-destructive/5 text-destructive flex w-full items-center gap-3 rounded-xl border p-4">
          <AlertCircle className="size-5 shrink-0" />
          <div className="text-sm">
            <h4 className="font-semibold">Temporada de trocas fechada</h4>
            <p className="opacity-90">
              A administração da escola fechou a temporada de trocas. Você pode
              visualizar os prêmios, mas não pode solicitar novos resgates no
              momento.
            </p>
          </div>
        </div>
      )}

      <div className="flex w-full flex-col gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <h1 className="text-lg font-bold text-gray-800">
          Prêmios para Resgate
        </h1>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-2.5">
            <span className="mb-0.5 block font-medium text-gray-500">
              Acumulado
            </span>
            <span className="text-sm font-bold text-gray-700">
              {student?.totalPoints}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-100 bg-amber-50/50 p-2.5">
            <span className="mb-0.5 block font-medium text-amber-600">
              Reservados
            </span>
            <span className="text-sm font-bold text-amber-500">
              {student?.reservedPoints}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-50 bg-emerald-50/50 p-2.5">
            <span className="mb-0.5 block font-medium text-emerald-600">
              Disponível
            </span>
            <span className="text-sm font-bold text-emerald-600">
              {student?.availablePoints}
            </span>
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
