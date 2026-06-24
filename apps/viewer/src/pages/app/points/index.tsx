import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useMetadata } from '@/hooks/use-metadata'
import { getStudentPoints } from '@/http/viewers/get-student-points'

import { PointsLoading } from './loading'

export function Points() {
  useMetadata('Ecokids - Pontos')

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'points'],
    queryFn: getStudentPoints,
  })

  if (isLoading) return <PointsLoading />

  const points = data?.points
  const totalPoints = data?.totalPoints

  const highestPoint =
    points && points.length > 0
      ? points.reduce((max, point) => (point.amount > max.amount ? point : max))
      : null

  const lowestPoint =
    points && points.length > 0
      ? points.reduce((min, point) => (point.amount < min.amount ? point : min))
      : null

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      <div className="flex w-full flex-col gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <h1 className="text-lg font-bold text-gray-800">Sua Pontuação</h1>

        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 px-4 py-6 text-white shadow-md shadow-emerald-100">
          <span className="text-xs font-semibold tracking-wide opacity-90">
            Total de pontos
          </span>
          <span className="mt-1 text-5xl font-extrabold tracking-tight">
            {totalPoints}
          </span>
        </div>

        {points && points.length > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
            <div className="rounded-xl border border-emerald-50 bg-emerald-50/50 p-2.5">
              <span className="mb-0.5 block font-medium text-gray-500">
                Maior
              </span>
              <span className="text-sm font-bold text-emerald-600">
                {highestPoint?.amount}
              </span>
            </div>
            <div className="rounded-xl border border-emerald-50 bg-emerald-50/50 p-2.5">
              <span className="mb-0.5 block font-medium text-gray-500">
                Menor
              </span>
              <span className="text-sm font-bold text-emerald-600">
                {lowestPoint?.amount}
              </span>
            </div>
            <div className="rounded-xl border border-emerald-50 bg-emerald-50/50 p-2.5">
              <span className="mb-0.5 block font-medium text-gray-500">
                Última
              </span>
              <span className="text-sm font-bold text-emerald-600">
                {points[points.length - 1].amount}
              </span>
            </div>
          </div>
        )}
      </div>

      {!points?.length ? (
        <div className="w-full rounded-3xl border-2 border-dashed border-emerald-100 bg-white py-12 text-center text-sm font-semibold text-gray-400 shadow-sm">
          Nenhum ponto registrado ainda. Comece a reciclar!
        </div>
      ) : (
        <div className="w-full rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
          <p className="mb-3 text-lg font-bold text-gray-800">
            Histórico de pontos
          </p>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={points[0].id}
          >
            {points?.map((point) => (
              <AccordionItem
                key={point.id}
                value={point.id}
                className="border-b border-emerald-50 last:border-0"
              >
                <AccordionTrigger className="py-4 font-semibold hover:no-underline">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">
                      {point.amount} pontos
                    </p>
                    <span className="text-xs font-medium text-gray-400">
                      {dayjs(point.createdAt).format('DD/MM/YYYY [às] HH:mm')}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="flex flex-col gap-3 pb-3 pt-1">
                  {point.scoreItems.map(({ id, value, amount, item }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100/50 bg-emerald-50/20 p-3"
                    >
                      <div className="flex items-center gap-3">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.name}
                            className="size-12 rounded-lg border border-emerald-50 bg-white object-contain"
                          />
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-100">
                            <span className="text-lg">♻️</span>
                          </div>
                        )}

                        <div className="space-y-0.5 text-left">
                          <p className="text-sm font-bold text-gray-800">
                            {amount} {item.name}
                          </p>

                          <p className="text-[10px] text-gray-500">
                            {value} pontos cada
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">
                          +{amount * value}{' '}
                          <span className="text-[10px] font-medium text-emerald-400">
                            pts
                          </span>
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
