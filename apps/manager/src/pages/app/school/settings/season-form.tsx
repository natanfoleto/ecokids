import { type CreateSeasonBody, createSeasonBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Loader2, Plus, Calendar } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormError } from '@/components/form/form-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { queryClient } from '@/lib/react-query'
import { getSeasons } from '@/http/seasons/get-seasons'
import { openSeasonAction, closeSeasonAction } from './season-actions'

export function SeasonForm() {
  const schoolSlug = useCurrentSchoolSlug()

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
          queryClient.invalidateQueries({ queryKey: ['seasons', schoolSlug] })
        }
      },
    )
  }

  if (isLoadingSeasons) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const activeSeason = seasonsData?.seasons.find((season) => season.status === 'OPEN')
  const previousSeasons = seasonsData?.seasons.filter((season) => season.status === 'CLOSED') ?? []

  return (
    <div className="space-y-8">
      {activeSeason ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Temporada Ativa
              </span>
              <h3 className="text-lg font-semibold text-foreground mt-2">{activeSeason.title}</h3>
              {activeSeason.description && (
                <p className="text-sm text-muted-foreground">{activeSeason.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Aberta em:{' '}
                {new Date(activeSeason.openedAt).toLocaleDateString('pt-BR', {
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
              onClick={handleCloseSeason}
              disabled={isClosePending}
              className="cursor-pointer"
            >
              {isClosePending ? (
                <Loader2 className="size-4 animate-spin mr-1" />
              ) : (
                'Fechar Temporada'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Abrir Temporada de Trocas</h3>
            <p className="text-sm text-muted-foreground">
              Inicie um período de trocas. Os alunos poderão resgatar prêmios na loja do aplicativo enquanto a temporada estiver aberta.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleOpenSeason)} className="space-y-4 max-w-xl">
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
              <Label htmlFor="description">Descrição / Instruções (Opcional)</Label>
              <textarea
                id="description"
                placeholder="Ex: Resgate de brinquedos e livros até o fim de julho."
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                <Loader2 className="size-4 animate-spin mr-1" />
              ) : (
                <>
                  <Plus className="size-4 mr-1" />
                  Abrir Temporada
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Histórico de Temporadas */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Calendar className="size-5 text-muted-foreground" />
          Histórico de Temporadas
        </h4>

        {previousSeasons.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhuma temporada encerrada anteriormente.</p>
        ) : (
          <div className="rounded-md border border-border">
            <div className="divide-y divide-border">
              {previousSeasons.map((season) => (
                <div key={season.id} className="p-4 flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{season.title}</p>
                    {season.description && (
                      <p className="text-xs text-muted-foreground">{season.description}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground font-light">
                      Aberta em:{' '}
                      {new Date(season.openedAt).toLocaleDateString('pt-BR')} | Fechada em:{' '}
                      {season.closedAt ? new Date(season.closedAt).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                    Encerrada
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
