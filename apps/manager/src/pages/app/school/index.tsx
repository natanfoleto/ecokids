import { keepPreviousData, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  Leaf,
  Percent,
  TrendingUp,
  Users,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMetadataSchool } from '@/hooks/use-metadata'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getSchoolMetrics } from '@/http/schools/get-school-metrics'

import { Tabs } from './tabs'

export function School() {
  useMetadataSchool('Dashboard')
  const schoolSlug = useCurrentSchoolSlug()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['schools', schoolSlug, 'metrics'],
    queryFn: async () => {
      const response = await getSchoolMetrics({
        params: {
          schoolSlug: schoolSlug!,
        },
      })
      return response
    },
    enabled: !!schoolSlug,
    placeholderData: keepPreviousData,
  })

  if (isError) {
    return (
      <div className="w-full space-y-4">
        <Tabs />
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium text-red-500">
            Erro ao carregar o painel da escola.
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Por favor, tente atualizar a página ou tente novamente mais tarde.
          </p>
        </div>
      </div>
    )
  }

  const hasData = data && data.metrics.totalPoints > 0

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Painel da Escola</h1>
        <p className="text-muted-foreground text-sm font-light">
          Acompanhe o engajamento estudantil e o impacto ambiental do programa
          de reciclagem em tempo real.
        </p>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : !hasData ? (
        <div className="bg-card/30 flex h-[350px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mb-4 rounded-full border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
            <Leaf className="size-8" />
          </div>
          <h3 className="text-lg font-semibold">Sem registros de reciclagem</h3>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            Nenhuma pontuação foi registrada ainda. Utilize o aplicativo coletor
            para começar a pontuar os alunos.
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in space-y-8 duration-500">
          {/* Top Level KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[1px] shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Pontos Gerados
                </CardTitle>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                  <Award className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {data.metrics.totalPoints.toLocaleString('pt-BR')}
                </div>
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
                  <TrendingUp className="size-3 text-emerald-500" />
                  Acumulado de toda a escola
                </p>
              </CardContent>
            </Card>

            <Card className="border-[1px] shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Itens Reciclados
                </CardTitle>
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                  <Leaf className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {data.metrics.totalItemsRecycled.toLocaleString('pt-BR')}
                </div>
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
                  <BarChart3 className="size-3 text-emerald-500" />
                  Total de unidades entregues
                </p>
              </CardContent>
            </Card>

            <Card className="border-[1px] shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Taxa de Participação
                </CardTitle>
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                  <Percent className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {data.metrics.participationPercentage}%
                </div>
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
                  <Users className="size-3 text-blue-500" />
                  Alunos ativos que participam
                </p>
              </CardContent>
            </Card>

            <Card className="border-[1px] shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Engajamento Pendente
                </CardTitle>
                <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-2 text-orange-600 dark:text-orange-400">
                  <Users className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {data.metrics.inactiveStudentsCount.toLocaleString('pt-BR')}
                </div>
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
                  <Calendar className="size-3 text-orange-500" />
                  Alunos com 0 pontos acumulados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboards and Activity Feed Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Classrooms Leaderboard */}
            <Card className="border-[1px] shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Ranking das Classes
                </CardTitle>
                <CardDescription>
                  Comparativo de pontos acumulados e engajamento por sala.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.classroomsLeaderboard.length === 0 ? (
                  <p className="text-muted-foreground py-6 text-center text-sm">
                    Nenhuma turma cadastrada.
                  </p>
                ) : (
                  data.classroomsLeaderboard.map((cls, idx) => {
                    const isTop1 = idx === 0
                    const isTop2 = idx === 1
                    const isTop3 = idx === 2

                    return (
                      <div
                        key={cls.id}
                        className="border-border bg-muted/20 hover:bg-muted/40 flex flex-col gap-2 rounded-xl border p-4 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex size-6 items-center justify-center rounded-full border text-xs font-bold ${
                                isTop1
                                  ? 'border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                  : isTop2
                                    ? 'border-slate-400/30 bg-slate-400/15 text-slate-600 dark:text-slate-400'
                                    : isTop3
                                      ? 'border-orange-500/30 bg-orange-500/15 text-orange-600 dark:text-orange-400'
                                      : 'bg-muted text-muted-foreground border-border'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <div>
                              <span className="text-foreground text-sm font-semibold">
                                {cls.name}
                              </span>
                              <span className="text-muted-foreground ml-2 text-xs font-light">
                                Ano: {cls.year}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-foreground text-sm font-bold">
                              {cls.totalPoints.toLocaleString('pt-BR')} pts
                            </span>
                            <p className="text-muted-foreground text-[10px] font-light">
                              {cls.studentsCount} alunos
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-1 w-full space-y-1">
                          <div className="text-muted-foreground flex justify-between text-[10px] font-light">
                            <span>Participação</span>
                            <span className="text-foreground font-medium">
                              {cls.participationRate}%
                            </span>
                          </div>
                          <div className="bg-muted border-border/30 h-1.5 w-full overflow-hidden rounded-full border">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${cls.participationRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            {/* Most Recycled Materials */}
            <Card className="border-[1px] shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Materiais Mais Entregues
                </CardTitle>
                <CardDescription>
                  Tipos de resíduos com maior volume coletado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.mostRecycledItems.length === 0 ? (
                  <p className="text-muted-foreground py-6 text-center text-sm">
                    Nenhum item coletado ainda.
                  </p>
                ) : (
                  (() => {
                    const maxQty = data.mostRecycledItems[0]?.totalQuantity || 1
                    return data.mostRecycledItems.map((item) => {
                      const percentage = Math.min(
                        100,
                        Math.round((item.totalQuantity / maxQty) * 100),
                      )
                      return (
                        <div key={item.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-medium">
                              {item.name}
                            </span>
                            <span className="text-muted-foreground text-xs font-semibold">
                              {item.totalQuantity.toLocaleString('pt-BR')} un
                            </span>
                          </div>
                          <div className="bg-muted border-border/30 h-2 w-full overflow-hidden rounded-full border">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground block text-[10px] font-light">
                            Pontos por unidade: {item.pointsValue}
                          </span>
                        </div>
                      )
                    })
                  })()
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Collections Timeline */}
          <Card className="border-[1px] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock className="size-4 text-emerald-500" />
                Registros Recentes de Coleta
              </CardTitle>
              <CardDescription>
                Últimos lançamentos realizados nos coletores da escola.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="border-border relative ml-4 space-y-6 border-l py-2 pl-5">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="group relative">
                    {/* Circle icon */}
                    <div className="border-background absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 bg-emerald-500 transition-transform group-hover:scale-125" />
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-semibold">
                          {activity.studentName}
                        </p>
                        <p className="text-muted-foreground text-xs font-light">
                          Turma: {activity.className} • Quantidade:{' '}
                          {activity.itemsCount} un.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:gap-1 sm:text-right">
                        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          +{activity.pointsAmount} pts
                        </span>
                        <p className="text-muted-foreground text-[10px] font-light">
                          {dayjs(activity.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8">
      {/* Top Level KPIs Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="border-[1px] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-[1px] shadow-sm lg:col-span-2">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="border-border flex flex-col gap-2 rounded-xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-1 space-y-1">
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[1px] shadow-sm">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline Skeleton */}
      <Card className="border-[1px] shadow-sm">
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="border-border ml-4 space-y-6 border-l py-2 pl-5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="relative">
                <div className="bg-border absolute -left-[25px] top-1.5 size-2.5 rounded-full" />
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:gap-1 sm:text-right">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
