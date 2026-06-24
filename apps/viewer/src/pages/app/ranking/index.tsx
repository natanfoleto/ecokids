import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { LoadingPage } from '@/components/loading-page'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/auth'
import { useMetadata } from '@/hooks/use-metadata'
import { getSchoolClasses } from '@/http/viewers/get-school-classes'
import { getSchoolRanking } from '@/http/viewers/get-school-ranking'

export function Ranking() {
  useMetadata('Ecokids - Ranking')

  const { student } = useAuth()
  const schoolId = student?.school.id

  const [classId, setClassId] = useState<string | undefined>(undefined)

  const { data: responseClasses, isLoading: isLoadingClasses } = useQuery({
    queryKey: ['school', 'classes', schoolId],
    queryFn: () =>
      getSchoolClasses({
        params: {
          schoolId: schoolId as string,
        },
      }),
    enabled: !!schoolId,
  })

  const { data: responseRanking, isLoading: isLoadingRanking } = useQuery({
    queryKey: ['school', 'ranking', schoolId, classId],
    queryFn: () =>
      getSchoolRanking({
        params: {
          schoolId: schoolId as string,
        },
        query: {
          ...(classId && classId !== 'all' ? { classId } : {}),
        },
      }),
    enabled: !!schoolId,
  })

  if (isLoadingClasses || isLoadingRanking)
    return <LoadingPage message="Carregando ranking de reciclagem" />

  const classes = responseClasses?.classes
  const ranking = responseRanking?.ranking

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 p-4">
      <div className="flex w-full flex-col gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <h1 className="text-lg font-bold text-gray-800">
          Ranking de Reciclagem
        </h1>

        <div className="space-y-1.5">
          <Label
            htmlFor="classes"
            className="text-xs font-semibold text-gray-500"
          >
            Filtrar por turma
          </Label>

          <Select onValueChange={(value) => setClassId(value)} value={classId}>
            <SelectTrigger
              id="classes"
              className="w-full rounded-xl border-emerald-200 focus:ring-emerald-500"
            >
              <SelectValue placeholder="Todas as turmas" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectGroup>
                <SelectItem value="all">Todas as turmas</SelectItem>

                {classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <div className="flex items-center justify-between border-b border-emerald-50 pb-2 text-xs font-bold text-gray-400">
          <span>Posição / Aluno</span>
          <span>Pontuação</span>
        </div>

        <div className="flex flex-col">
          {ranking?.map((pos, index) => {
            const rank = index + 1
            const isTop1 = rank === 1
            const isTop2 = rank === 2
            const isTop3 = rank === 3

            let rankBadgeClass =
              'text-gray-500 font-bold text-sm size-8 flex items-center justify-center'
            if (isTop1)
              rankBadgeClass =
                'bg-yellow-100 text-yellow-800 border border-yellow-200 font-bold rounded-full size-8 flex items-center justify-center text-sm shadow-sm'
            if (isTop2)
              rankBadgeClass =
                'bg-slate-100 text-slate-800 border border-slate-200 font-bold rounded-full size-8 flex items-center justify-center text-sm shadow-sm'
            if (isTop3)
              rankBadgeClass =
                'bg-orange-100 text-orange-800 border border-orange-200 font-bold rounded-full size-8 flex items-center justify-center text-sm shadow-sm'

            return (
              <div
                key={pos.id}
                className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className={rankBadgeClass}>
                    {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : rank}
                  </span>
                  <span
                    className={`text-sm font-semibold ${isTop1 ? 'font-bold text-gray-900' : 'text-gray-700'}`}
                  >
                    {pos.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  {pos.totalPoints}{' '}
                  <span className="text-[10px] font-medium text-emerald-400">
                    pts
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
