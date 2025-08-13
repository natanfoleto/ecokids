import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { LoadingPage } from '@/components/loading-page'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
      <div className="bg-muted flex w-full flex-col justify-between gap-4 rounded-xl border-t-4 border-emerald-400 p-4">
        <h1 className="font-semibold">Ranking de reciclagem dos alunos</h1>

        <div className="space-y-2">
          <Label
            htmlFor="classes"
            className="text-muted-foreground font-normal"
          >
            Filtrar por turma
          </Label>

          <Select onValueChange={(value) => setClassId(value)} value={classId}>
            <SelectTrigger id="classes" className="w-full">
              <SelectValue placeholder="Turmas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Turmas</SelectLabel>

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

      <div className="bg-muted flex w-full flex-col justify-between gap-4 rounded-xl border-t-4 border-emerald-400 p-4">
        <div className="grid grid-cols-12 font-semibold">
          <span className="col-span-1">#</span>
          <span className="col-span-9">Nome</span>
          <span className="col-span-2">Pontos</span>
        </div>

        {ranking?.map((pos, index) => (
          <div key={pos.id} className="grid grid-cols-12 gap-2 text-sm">
            <span className="col-span-1">{++index}</span>
            <span className="col-span-9">{pos.name}</span>
            <span className="col-span-2">{pos.totalPoints}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
