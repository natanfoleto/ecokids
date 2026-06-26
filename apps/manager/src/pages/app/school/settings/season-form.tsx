import { type CreateSeasonBody, createSeasonBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Calendar, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getSeasons } from '@/http/seasons/get-seasons'
import { queryClient } from '@/lib/react-query'

import {
  closeSeasonAction,
  deleteSeasonAction,
  openSeasonAction,
  reopenSeasonAction,
  updateSchoolSettingsAction,
} from './season-actions'

export function SeasonForm() {
  const schoolSlug = useCurrentSchoolSlug()

  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const [selectedSeasonToReopen, setSelectedSeasonToReopen] = useState<
    string | null
  >(null)
  const [selectedSeasonToDelete, setSelectedSeasonToDelete] = useState<
    string | null
  >(null)

  const { data: seasonsData, isLoading: isLoadingSeasons } = useQuery({
    queryKey: ['seasons', schoolSlug],
    queryFn: async () => {
      return getSeasons({
        params: {
          schoolSlug: schoolSlug!,
        },
      })
    },
    placeholderData: keepPreviousData,
    enabled: !!schoolSlug,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSeasonBody>({
    resolver: zodResolver(createSeasonBodySchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const [, handleOpenAction, isOpenPending] = useAction()
  const [, handleCloseAction, isClosePending] = useAction()
  const [, handleReopenAction, isReopenPending] = useAction()
  const [, handleDeleteAction, isDeletePending] = useAction()

  async function handleOpenSeason(body: CreateSeasonBody) {
    if (!schoolSlug) return

    handleOpenAction(
      () => openSeasonAction({ schoolSlug, body }),
      (data) => {
        if (data.success) {
          reset()
          queryClient.invalidateQueries({ queryKey: ['seasons', schoolSlug] })
        }
      },
    )
  }

  async function handleCloseSeason() {
    if (!schoolSlug) return

    handleCloseAction(
      () => closeSeasonAction({ schoolSlug }),
      (data) => {
        if (data.success) {
          setIsCloseDialogOpen(false)
          setConfirmText('')
          queryClient.invalidateQueries({ queryKey: ['seasons', schoolSlug] })
        }
      },
    )
  }

  async function handleReopenSeason(seasonId: string) {
    if (!schoolSlug) return

    handleReopenAction(
      () => reopenSeasonAction({ schoolSlug, seasonId }),
      (data) => {
        if (data.success) {
          setSelectedSeasonToReopen(null)
          queryClient.invalidateQueries({ queryKey: ['seasons', schoolSlug] })
        }
      },
    )
  }

  async function handleDeleteSeason(seasonId: string) {
    if (!schoolSlug) return

    handleDeleteAction(
      () => deleteSeasonAction({ schoolSlug, seasonId }),
      (data) => {
        if (data.success) {
          setSelectedSeasonToDelete(null)
          queryClient.invalidateQueries({ queryKey: ['seasons', schoolSlug] })
        }
      },
    )
  }

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    setValue: setSettingsValue,
    formState: { errors: settingsErrors, isDirty: isSettingsDirty },
  } = useForm<{ nextSeasonMessage: string }>({
    defaultValues: {
      nextSeasonMessage: '',
    },
  })

  useEffect(() => {
    if (seasonsData?.nextSeasonMessage !== undefined) {
      setSettingsValue('nextSeasonMessage', seasonsData.nextSeasonMessage || '')
    }
  }, [seasonsData?.nextSeasonMessage, setSettingsValue])

  const [, handleUpdateSettingsAction, isUpdateSettingsPending] = useAction()

  async function handleUpdateSettings(data: { nextSeasonMessage: string }) {
    if (!schoolSlug) return

    handleUpdateSettingsAction(
      () =>
        updateSchoolSettingsAction({
          schoolSlug,
          body: {
            nextSeasonMessage: data.nextSeasonMessage.trim() || null,
          },
        }),
      (response) => {
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ['seasons', schoolSlug] })
        }
      },
    )
  }

  if (isLoadingSeasons) {
    return <SeasonFormSkeleton />
  }

  const activeSeason = seasonsData?.seasons.find(
    (season) => season.status === 'OPEN',
  )
  const previousSeasons =
    seasonsData?.seasons.filter((season) => season.status === 'CLOSED') ?? []

  return (
    <div className="space-y-8">
      {activeSeason ? (
        <div className="space-y-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="w-full space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                Temporada Ativa
              </span>
              <h3 className="text-foreground mt-2 text-lg font-semibold">
                {activeSeason.title}
              </h3>
              {activeSeason.description && (
                <p className="text-muted-foreground text-sm">
                  {activeSeason.description}
                </p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                Aberta em:{' '}
                {new Date(activeSeason.openedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>

              {/* Tinted cardlets stats for Active Season */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-emerald-500/10 pt-4 sm:grid-cols-6">
                <div className="bg-muted/40 border-border/20 rounded-lg border p-3 text-center">
                  <span className="text-muted-foreground block text-xs font-normal">
                    Solicitações
                  </span>
                  <span className="text-foreground text-lg font-bold">
                    {activeSeason.stats.totalRedemptions}
                  </span>
                </div>
                <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-3 text-center">
                  <span className="block text-xs font-medium text-emerald-500/70">
                    Aprovados
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {activeSeason.stats.approvedCount}
                  </span>
                </div>
                <div className="rounded-lg border border-rose-500/10 bg-rose-500/5 p-3 text-center">
                  <span className="block text-xs font-medium text-rose-500/70">
                    Rejeitados
                  </span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {activeSeason.stats.rejectedCount}
                  </span>
                </div>
                <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-3 text-center">
                  <span className="block text-xs font-medium text-amber-500/70">
                    Cancelados
                  </span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {activeSeason.stats.cancelledCount}
                  </span>
                </div>
                <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3 text-center">
                  <span className="block text-xs font-medium text-blue-500/70">
                    Entregues
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {activeSeason.stats.deliveredCount}
                  </span>
                </div>
                <div className="rounded-lg border border-violet-500/10 bg-violet-500/5 p-3 text-center">
                  <span className="block text-xs font-medium text-violet-500/70">
                    Pontos Utilizados
                  </span>
                  <span className="block truncate text-lg font-bold text-violet-600 dark:text-violet-400">
                    {activeSeason.stats.totalPointsCost.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {activeSeason.stats.totalRedemptions === 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSeasonToDelete(activeSeason.id)}
                  className="cursor-pointer hover:bg-rose-500/10 hover:text-rose-500"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => setIsCloseDialogOpen(true)}
                className="cursor-pointer"
              >
                Fechar Temporada
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-border space-y-6 rounded-lg border p-6">
          <div className="space-y-1">
            <h3 className="text-foreground text-lg font-semibold">
              Abrir Temporada de Trocas
            </h3>
            <p className="text-muted-foreground text-sm">
              Inicie um período de trocas. Os alunos poderão resgatar prêmios na
              loja do aplicativo enquanto a temporada estiver aberta.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleOpenSeason)}
            className="max-w-xl space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Título da Temporada</Label>
              <Input
                id="title"
                placeholder="Ex: Temporada de Inverno 2026"
                {...register('title')}
              />
              <FormError error={errors.title?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descrição / Instruções (Opcional)
              </Label>
              <textarea
                id="description"
                placeholder="Ex: Resgate de brinquedos e livros até o fim de julho."
                rows={3}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('description')}
              />
              <FormError error={errors.description?.message} />
            </div>

            <Button
              type="submit"
              disabled={isOpenPending}
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            >
              {isOpenPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Abrir Temporada'
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Previsão de Abertura */}
      <div className="border-border space-y-6 rounded-lg border p-6">
        <div className="space-y-1">
          <h3 className="text-foreground text-lg font-semibold">
            Previsão de Abertura no Aplicativo do Aluno
          </h3>
          <p className="text-muted-foreground text-sm font-light">
            Defina a mensagem de aviso que será exibida no aplicativo do aluno
            (viewer) quando a temporada de trocas estiver fechada. Use esta
            instrução para avisar aos alunos quando a direção pretende abrir a
            temporada.
          </p>
        </div>

        <form
          onSubmit={handleSubmitSettings(handleUpdateSettings)}
          className="max-w-xl space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="nextSeasonMessage">Instrução de abertura</Label>
            <textarea
              id="nextSeasonMessage"
              placeholder="Ex: Pretendemos abrir a temporada de trocas no início de agosto de 2026."
              rows={3}
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
              {...registerSettings('nextSeasonMessage')}
            />
            <FormError error={settingsErrors.nextSeasonMessage?.message} />
          </div>

          <Button
            type="submit"
            disabled={isUpdateSettingsPending || !isSettingsDirty}
            className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
          >
            {isUpdateSettingsPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Salvar'
            )}
          </Button>
        </form>
      </div>

      {/* Histórico de Temporadas */}
      <div className="space-y-4">
        <h4 className="text-foreground flex items-center gap-2 text-base font-semibold">
          Histórico de Temporadas
        </h4>

        {previousSeasons.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma temporada encerrada anteriormente.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {previousSeasons.map((season, index) => (
              <div
                key={season.id}
                className="border-border bg-card/45 hover:bg-card group relative flex flex-col justify-between gap-6 rounded-xl border p-6 transition-all duration-300 hover:border-zinc-300 hover:shadow-sm lg:flex-row lg:items-center dark:hover:border-zinc-700"
              >
                <div className="flex-1 space-y-2.5 pl-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h5 className="text-foreground text-base font-semibold tracking-tight">
                      {season.title}
                    </h5>
                    <span className="inline-flex select-none items-center rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                      Encerrada
                    </span>
                  </div>

                  {season.description && (
                    <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                      {season.description}
                    </p>
                  )}

                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Calendar className="text-muted-foreground/75 size-3.5" />
                    <span>
                      {new Date(season.openedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      a{' '}
                      {season.closedAt
                        ? new Date(season.closedAt).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )
                        : '-'}
                    </span>
                  </div>
                </div>

                <div className="border-border flex w-full flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:gap-6 lg:w-auto lg:border-t-0 lg:pt-0">
                  {/* Primary metrics */}
                  <div className="sm:border-border/60 flex gap-6 sm:mr-2 sm:border-r sm:pr-6">
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                        Solicitações
                      </span>
                      <span className="text-foreground text-xl font-bold">
                        {season.stats.totalRedemptions}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-semibold uppercase tracking-wider">
                        Pontos
                      </span>
                      <span className="text-foreground text-xl font-bold">
                        {season.stats.totalPointsCost.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Status breakdown indicator list */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-2.5 py-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {season.stats.approvedCount} Aprovados
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/10 bg-blue-500/5 px-2.5 py-1">
                      <span className="size-1.5 rounded-full bg-blue-500" />
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {season.stats.deliveredCount} Entregues
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/10 bg-rose-500/5 px-2.5 py-1">
                      <span className="size-1.5 rounded-full bg-rose-500" />
                      <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
                        {season.stats.rejectedCount} Rejeitados
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/10 bg-amber-500/5 px-2.5 py-1">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        {season.stats.cancelledCount} Cancelados
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-border flex items-center justify-end gap-2 border-t pt-4 lg:border-t-0 lg:pl-4 lg:pt-0">
                  {season.stats.totalRedemptions === 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedSeasonToDelete(season.id)}
                      className="text-muted-foreground h-9 w-9 cursor-pointer transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                      title="Excluir temporada"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                  {!activeSeason && index === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSeasonToReopen(season.id)}
                      className="h-9 cursor-pointer px-4 text-xs transition-all hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                    >
                      Reabrir
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog to Close Season */}
      <Dialog
        open={isCloseDialogOpen}
        onOpenChange={(open) => {
          setIsCloseDialogOpen(open)
          if (!open) setConfirmText('')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fechar Temporada de Troca</DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <span>Você está prestes a fechar esta temporada de troca.</span>
              <span className="text-destructive block font-semibold">
                Após o fechamento:
              </span>
              <ul className="list-disc space-y-1 pl-4 text-xs">
                <li>alunos não poderão solicitar novos prêmios</li>
                <li>novos resgates serão bloqueados imediatamente</li>
              </ul>
              <span className="text-foreground block pt-2 font-medium">
                Digite <span className="font-bold">FECHAR</span> para confirmar.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="FECHAR"
            />
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCloseDialogOpen(false)
                setConfirmText('')
              }}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCloseSeason}
              disabled={confirmText !== 'FECHAR' || isClosePending}
              className="cursor-pointer"
            >
              {isClosePending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Confirmar Fechamento'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog to Reopen Season */}
      <Dialog
        open={!!selectedSeasonToReopen}
        onOpenChange={() => setSelectedSeasonToReopen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reabrir Temporada de Troca</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja reabrir esta temporada? Os alunos poderão
              voltar a solicitar resgates na loja do aplicativo enquanto a
              temporada estiver aberta.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSelectedSeasonToReopen(null)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedSeasonToReopen &&
                handleReopenSeason(selectedSeasonToReopen)
              }
              disabled={isReopenPending}
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            >
              {isReopenPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Reabrir Temporada'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog to Delete Season */}
      <Dialog
        open={!!selectedSeasonToDelete}
        onOpenChange={() => setSelectedSeasonToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Temporada de Troca</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente esta temporada?
              Esta ação removerá o registro de forma definitiva e não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSelectedSeasonToDelete(null)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedSeasonToDelete &&
                handleDeleteSeason(selectedSeasonToDelete)
              }
              disabled={isDeletePending}
              className="cursor-pointer"
            >
              {isDeletePending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Excluir Temporada'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SeasonFormSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Active Season Skeleton Card */}
      <div className="border-border/50 space-y-4 rounded-lg border p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="w-full space-y-3">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />

            <div className="mt-6 grid grid-cols-2 gap-3 pt-4 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="border-border/50 space-y-2 rounded-lg border p-3"
                >
                  <Skeleton className="mx-auto h-3 w-16 rounded-md" />
                  <Skeleton className="mx-auto h-5 w-8 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* History Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-40 rounded-md" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="border-border/50 flex flex-col justify-between gap-6 rounded-xl border p-6 lg:flex-row lg:items-center"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-72 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
