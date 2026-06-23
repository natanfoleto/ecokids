import {
  type CreateSchoolSeasonBody,
  createSchoolSeasonBodySchema,
  type FinishSchoolSeasonBody,
  finishSchoolSeasonBodySchema,
} from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Calendar, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormError } from '@/components/form/form-error'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getSchoolSeasons } from '@/http/school-seasons/get-school-seasons'
import { queryClient } from '@/lib/react-query'

import {
  createSchoolSeasonAction,
  finishSchoolSeasonAction,
} from './school-season-actions'

export function SchoolSeasonForm() {
  const schoolSlug = useCurrentSchoolSlug()
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)

  const { data: seasonsData, isLoading: isLoadingSeasons } = useQuery({
    queryKey: ['school-seasons', schoolSlug],
    queryFn: async () => {
      return getSchoolSeasons({
        params: {
          schoolSlug: schoolSlug!,
        },
      })
    },
    placeholderData: keepPreviousData,
    enabled: !!schoolSlug,
  })

  // Form for initial season creation
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
  } = useForm<CreateSchoolSeasonBody>({
    resolver: zodResolver(createSchoolSeasonBodySchema),
    defaultValues: {
      name: '',
    },
  })

  // Form for finishing current and opening next season
  const {
    register: registerFinish,
    handleSubmit: handleSubmitFinish,
    reset: resetFinish,
    formState: { errors: errorsFinish },
  } = useForm<FinishSchoolSeasonBody>({
    resolver: zodResolver(finishSchoolSeasonBodySchema),
    defaultValues: {
      newSeasonName: '',
    },
  })

  const [, handleCreateAction, isCreatePending] = useAction()
  const [, handleFinishAction, isFinishPending] = useAction()

  async function handleStartInitialSeason(body: CreateSchoolSeasonBody) {
    if (!schoolSlug) return

    handleCreateAction(
      () => createSchoolSeasonAction({ schoolSlug, body }),
      (data) => {
        if (data.success) {
          resetCreate()
          queryClient.invalidateQueries({
            queryKey: ['school-seasons', schoolSlug],
          })
          queryClient.invalidateQueries({
            queryKey: ['schools', schoolSlug],
          })
        }
      },
    )
  }

  async function handleFinishCurrentSeason(body: FinishSchoolSeasonBody) {
    if (!schoolSlug) return

    handleFinishAction(
      () => finishSchoolSeasonAction({ schoolSlug, body }),
      (data) => {
        if (data.success) {
          resetFinish()
          setIsFinishDialogOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['school-seasons', schoolSlug],
          })
          queryClient.invalidateQueries({
            queryKey: ['schools', schoolSlug],
          })
        }
      },
    )
  }

  if (isLoadingSeasons) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    )
  }

  const activeSeason = seasonsData?.seasons.find(
    (season) => season.status === 'ACTIVE',
  )
  const previousSeasons =
    seasonsData?.seasons.filter((season) => season.status === 'FINISHED') ?? []

  return (
    <div className="space-y-8">
      {activeSeason ? (
        <div className="space-y-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Ciclo Ativo
              </span>
              <h3 className="text-foreground mt-2 text-lg font-semibold">
                {activeSeason.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-xs">
                Iniciado em:{' '}
                {new Date(activeSeason.startedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <Button
              variant="destructive"
              onClick={() => setIsFinishDialogOpen(true)}
              className="cursor-pointer"
            >
              Encerrar Ciclo Atual
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-border space-y-6 rounded-lg border p-6">
          <div className="space-y-1">
            <h3 className="text-foreground text-lg font-semibold">
              Iniciar Primeiro Ciclo de Pontuação
            </h3>
            <p className="text-muted-foreground text-sm">
              Esta escola não possui nenhum ciclo de pontuação ativo. Inicie um
              ciclo para que os alunos possam começar a acumular pontos.
            </p>
          </div>

          <form
            onSubmit={handleSubmitCreate(handleStartInitialSeason)}
            className="max-w-xl space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Ciclo</Label>
              <Input
                id="name"
                placeholder="Ex: Ciclo Letivo 2026, 1º Semestre 2026"
                {...registerCreate('name')}
              />
              <FormError error={errorsCreate.name?.message} />
            </div>

            <Button
              type="submit"
              disabled={isCreatePending}
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            >
              {isCreatePending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Iniciar Ciclo'
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Histórico de Temporadas */}
      <div className="space-y-4">
        <h4 className="text-foreground flex items-center gap-2 text-base font-semibold">
          <Calendar className="text-muted-foreground size-5" />
          Histórico de Ciclos
        </h4>

        {previousSeasons.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum ciclo encerrado anteriormente.
          </p>
        ) : (
          <div className="border-border rounded-md border">
            <div className="divide-border divide-y">
              {previousSeasons.map((season) => (
                <div
                  key={season.id}
                  className="flex items-center justify-between p-4 text-sm"
                >
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">{season.name}</p>
                    <p className="text-muted-foreground text-[11px] font-light">
                      Iniciado em:{' '}
                      {new Date(season.startedAt).toLocaleDateString('pt-BR')} |
                      Encerrado em:{' '}
                      {season.endedAt
                        ? new Date(season.endedAt).toLocaleDateString('pt-BR')
                        : '-'}
                    </p>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div className="text-xs">
                      <p className="text-muted-foreground">Pontos Totais</p>
                      <p className="text-foreground font-semibold">
                        {season.totalPoints}
                      </p>
                    </div>
                    <div className="text-xs">
                      <p className="text-muted-foreground">Alunos Ativos</p>
                      <p className="text-foreground font-semibold">
                        {season.uniqueStudentsCount}
                      </p>
                    </div>
                    <div className="text-xs">
                      <p className="text-muted-foreground">
                        Prêmios Resgatados
                      </p>
                      <p className="text-foreground font-semibold">
                        {season.totalRedemptions}
                      </p>
                    </div>
                    <span className="bg-muted text-muted-foreground border-border inline-flex h-fit items-center self-center rounded-full border px-2 py-0.5 text-xs font-medium">
                      Encerrado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog to Finish Season */}
      <Dialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encerrar Ciclo de Pontuação</DialogTitle>
            <DialogDescription>
              Encerrar o ciclo atual resetará o ranking da escola e iniciará um
              novo ciclo letivo para os alunos. Todos os dados históricos serão
              preservados permanentemente. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmitFinish(handleFinishCurrentSeason)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="newSeasonName">
                Nome do Próximo Ciclo de Pontuação
              </Label>
              <Input
                id="newSeasonName"
                placeholder="Ex: Ciclo Letivo 2027"
                {...registerFinish('newSeasonName')}
              />
              <FormError error={errorsFinish.newSeasonName?.message} />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFinishDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isFinishPending}
                className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
              >
                {isFinishPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Confirmar Encerramento'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
