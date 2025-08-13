import { useQuery } from '@tanstack/react-query'

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

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      <div className="bg-muted flex w-full flex-col justify-between gap-3 rounded-xl border-t-4 border-emerald-400 p-4">
        <h1 className="font-semibold">Prêmios para resgate</h1>

        <div className="flex w-full items-center justify-between text-sm">
          <p>Sua pontuação para resgate</p>
          <span>{student?.totalPoints}</span>
        </div>
      </div>

      <div className="xs:grid-cols-2 grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {student &&
          itens?.map((item) => (
            <Item key={item.id} item={item} totalPoints={student.totalPoints} />
          ))}
      </div>
    </div>
  )
}
