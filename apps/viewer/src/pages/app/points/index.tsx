import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { LoadingPage } from '@/components/loading-page'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getStudentPoints } from '@/http/students/get-student-points'

export function Points() {
  const { data, isLoading } = useQuery({
    queryKey: ['student', 'points'],
    queryFn: getStudentPoints,
  })

  if (isLoading) return <LoadingPage message="Carregando pontos do estudante" />

  const points = data?.points
  const totalPoints = data?.totalPoints

  const highestPoint = points?.reduce((max, point) =>
    point.amount > max.amount ? point : max,
  )

  const lowestPoint = points?.reduce((min, point) =>
    point.amount < min.amount ? point : min,
  )

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      <div className="bg-muted flex w-full flex-col justify-between gap-3 rounded-xl border-t-4 border-emerald-400 p-4">
        <h1 className="font-semibold">Sua pontuação</h1>

        <div className="w-full space-y-0.5">
          <div className="items-cente flex w-full justify-between text-sm">
            <p>Total de pontos</p>
            <span>{totalPoints}</span>
          </div>

          {points?.length && (
            <div className="w-full space-y-0.5 text-sm">
              <div className="flex w-full items-center justify-between">
                <p>Maior pontuação</p>
                <span>{highestPoint?.amount}</span>
              </div>

              <div className="flex w-full items-center justify-between">
                <p>Menor pontuação</p>
                <span>{lowestPoint?.amount}</span>
              </div>

              <div className="flex w-full items-center justify-between">
                <p>Última pontuação</p>
                <span>{points[points.length - 1].amount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!points?.length ? (
        <div className="w-full text-center text-sm">...</div>
      ) : (
        <div className="bg-muted w-full rounded-xl border-t-4 border-emerald-400 px-3 pt-3">
          <p className="mb-3 font-semibold">Histórico de pontos</p>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={points[0].id}
          >
            {points?.map((point) => (
              <AccordionItem key={point.id} value={point.id}>
                <AccordionTrigger className="font-normal">
                  <div className="flex w-full items-center justify-between">
                    <p>{point.amount} pontos</p>
                    <span className="text-xs">
                      {dayjs(point.createdAt).format('DD/MM/YYYY [às] HH:mm')}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="flex flex-col gap-4">
                  {point.scoreItems.map(({ id, value, amount, item }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div key={id} className="flex items-center gap-3">
                        <img
                          src={item.photoUrl || undefined}
                          alt={item.name}
                          className="size-14 rounded-md"
                        />

                        <div className="space-y-0.5">
                          <p className="font-medium">
                            {amount} {item.name}{' '}
                          </p>

                          <p className="text-muted-foreground text-xs">
                            {value} pontos cada
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-1">
                        <p className="font-medium">
                          {amount * value}{' '}
                          <span className="text-xs font-normal">pontos</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  )
}
