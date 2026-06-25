import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'

import { RankingLoading } from './loading'

export function Ranking() {
  useMetadata('Ecokids - Ranking')

  const { student } = useAuth()
  const schoolId = student?.school.id

  const [classId, setClassId] = useState<string | undefined>(undefined)
  const [lastLoadedClassId, setLastLoadedClassId] = useState<
    string | undefined
  >(undefined)
  const [showAll, setShowAll] = useState(false)

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

  const {
    data: responseRanking,
    isLoading: isLoadingRanking,
    isFetching: isFetchingRanking,
  } = useQuery({
    queryKey: ['school', 'ranking', schoolId, classId, showAll],
    queryFn: () =>
      getSchoolRanking({
        params: {
          schoolId: schoolId as string,
        },
        query: {
          ...(classId && classId !== 'all' ? { classId } : {}),
          ...(showAll ? {} : { limit: 10 }),
        },
      }),
    enabled: !!schoolId,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (responseRanking && !isFetchingRanking) {
      setLastLoadedClassId(classId)
    }
  }, [responseRanking, isFetchingRanking, classId])

  if (isLoadingClasses || isLoadingRanking || classId !== lastLoadedClassId)
    return <RankingLoading />

  const classes = responseClasses?.classes
  const ranking = responseRanking?.ranking
  const studentStats = responseRanking?.studentStats

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 p-4">
      {/* Title at the very top of the page */}
      <div className="w-full px-1 text-left">
        <h1 className="text-2xl font-black text-gray-800">
          Ranking de Reciclagem
        </h1>
      </div>

      {/* Card com informações do aluno logado */}
      {studentStats && (
        <div className="w-full rounded-3xl border-2 border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-50">
          <div className="grid grid-cols-2 gap-4 border-b border-emerald-50 pb-4">
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-gray-400">
                Sua posição
              </span>
              <span className="block text-3xl font-extrabold text-emerald-600">
                #{studentStats.position}
              </span>
            </div>
            <div className="space-y-1 text-right">
              <span className="block text-xs font-semibold text-gray-400">
                Seus pontos
              </span>
              <span className="block text-3xl font-extrabold text-emerald-600">
                {studentStats.totalPoints}{' '}
                <span className="text-sm font-bold text-emerald-400">pts</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            {studentStats.pointsToNext !== null &&
              studentStats.pointsToNext > 0 && (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <span className="inline-block size-2 rounded-full bg-teal-500" />
                  Faltam apenas{' '}
                  <strong className="text-teal-600">
                    {studentStats.pointsToNext} pontos
                  </strong>{' '}
                  para ultrapassar o próximo colocado
                </p>
              )}

            {studentStats.pointsToFirst > 0 ? (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <span className="inline-block size-2 rounded-full bg-yellow-500" />
                Faltam{' '}
                <strong className="text-yellow-600">
                  {studentStats.pointsToFirst} pontos
                </strong>{' '}
                para alcançar o 1º lugar
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs font-bold text-yellow-600">
                🥇 Você está em 1º lugar! Parabéns!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Combined Card (Filter + Leaderboard Table) */}
      <div className="flex w-full flex-col gap-5 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">
            Tabela de posições
          </h2>

          <div className="space-y-1.5">
            <Label
              htmlFor="classes"
              className="text-xs font-semibold text-gray-500"
            >
              Filtrar por turma
            </Label>

            <Select
              onValueChange={(value) => {
                setClassId(value)
                setShowAll(false)
              }}
              value={classId}
            >
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

        <div className="flex flex-col gap-3 border-t border-emerald-50 pt-4">
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
              const isCurrentUser = pos.id === student?.id

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
                  className={cn(
                    'flex items-center justify-between border-b border-gray-50 py-3 last:border-0',
                    isCurrentUser &&
                      'my-1 rounded-r-xl border-l-4 border-l-emerald-500 bg-emerald-50/40 pl-3 pr-2',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={rankBadgeClass}>
                      {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : rank}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        isTop1 ? 'font-bold text-gray-900' : 'text-gray-700',
                      )}
                    >
                      {pos.name}
                      {isCurrentUser && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Você
                        </span>
                      )}
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

          {ranking && ranking.length === 10 && !showAll && (
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="mt-4 h-11 w-full cursor-pointer rounded-2xl border-emerald-100 font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Exibir ranking completo
            </Button>
          )}

          {showAll && isFetchingRanking && (
            <div className="mt-4 flex w-full items-center justify-center py-2">
              <Loader2 className="size-5 animate-spin text-gray-300" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
