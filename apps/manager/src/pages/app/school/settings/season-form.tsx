import { type CreateSeasonBody, createSeasonBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Calendar, Loader2, Trash2 } from 'lucide-react'
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
import { getSeasons } from '@/http/seasons/get-seasons'
import { queryClient } from '@/lib/react-query'

import {
  closeSeasonAction,
  deleteSeasonAction,
  openSeasonAction,
  reopenSeasonAction,
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

  if (isLoadingSeasons) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    )
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
            <div className="space-y-1">
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

              <div className="text-muted-foreground mt-4 grid grid-cols-2 gap-2 border-t border-emerald-500/10 pt-2 text-xs sm:grid-cols-6">
                <div>
                  Solicitações:{' '}
                  <span className="text-foreground font-semibold">
                    {activeSeason.stats.totalRedemptions}
                  </span>
                </div>
                <div>
                  Aprovados:{' '}
                  <span className="font-semibold text-emerald-600">
                    {activeSeason.stats.approvedCount}
                  </span>
                </div>
                <div>
                  Rejeitados:{' '}
                  <span className="font-semibold text-rose-600">
                    {activeSeason.stats.rejectedCount}
                  </span>
                </div>
                <div>
                  Cancelados:{' '}
                  <span className="font-semibold text-amber-600">
                    {activeSeason.stats.cancelledCount}
                  </span>
                </div>
                <div>
                  Entregues:{' '}
                  <span className="font-semibold text-blue-600">
                    {activeSeason.stats.deliveredCount}
                  </span>
                </div>
                <div>
                  Pontos utilizados:{' '}
                  <span className="text-foreground font-semibold">
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

      {/* Histórico de Temporadas */}
      <div className="space-y-4">
        <h4 className="text-foreground flex items-center gap-2 text-base font-semibold">
          <Calendar className="text-muted-foreground size-5" />
          Histórico de Temporadas
        </h4>

        {previousSeasons.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma temporada encerrada anteriormente.
          </p>
        ) : (
          <div className="border-border rounded-md border">
            <div className="divide-border divide-y">
              {previousSeasons.map((season, index) => (
                <div
                  key={season.id}
                  className="flex items-center justify-between gap-4 p-4 text-sm"
                >
                  <div className="w-full space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-medium">
                        {season.title}
                      </p>
                      <span className="bg-muted text-muted-foreground border-border inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
                        Encerrada
                      </span>
                    </div>
                    {season.description && (
                      <p className="text-muted-foreground text-xs">
                        {season.description}
                      </p>
                    )}
                    <p className="text-muted-foreground text-[11px] font-light">
                      Aberta em:{' '}
                      {new Date(season.openedAt).toLocaleDateString('pt-BR')} |
                      Fechada em:{' '}
                      {season.closedAt
                        ? new Date(season.closedAt).toLocaleDateString('pt-BR')
                        : '-'}
                    </p>

                    <div className="text-muted-foreground border-border mt-2 grid grid-cols-2 gap-2 border-t pt-2 text-[11px] sm:grid-cols-6">
                      <div>
                        Solicitações:{' '}
                        <span className="text-foreground font-semibold">
                          {season.stats.totalRedemptions}
                        </span>
                      </div>
                      <div>
                        Aprovados:{' '}
                        <span className="font-semibold text-emerald-600">
                          {season.stats.approvedCount}
                        </span>
                      </div>
                      <div>
                        Rejeitados:{' '}
                        <span className="font-semibold text-rose-600">
                          {season.stats.rejectedCount}
                        </span>
                      </div>
                      <div>
                        Cancelados:{' '}
                        <span className="font-semibold text-amber-600">
                          {season.stats.cancelledCount}
                        </span>
                      </div>
                      <div>
                        Entregues:{' '}
                        <span className="font-semibold text-blue-600">
                          {season.stats.deliveredCount}
                        </span>
                      </div>
                      <div>
                        Pontos:{' '}
                        <span className="text-foreground font-semibold">
                          {season.stats.totalPointsCost.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {season.stats.totalRedemptions === 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedSeasonToDelete(season.id)}
                        className="cursor-pointer hover:bg-rose-500/10 hover:text-rose-500"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                    {!activeSeason && index === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSeasonToReopen(season.id)}
                        className="cursor-pointer text-xs"
                      >
                        Reabrir
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
