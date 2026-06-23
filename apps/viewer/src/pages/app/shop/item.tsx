import type { GetSchoolShopResponse } from '@ecokids/types'
import { HTTPError } from 'ky'
import { AlertTriangle, Award, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth'
import { createRedemption } from '@/http/viewers/create-redemption'
import { queryClient } from '@/lib/react-query'

interface ItemProps {
  item: GetSchoolShopResponse['itens'][number]
  availablePoints: number
  isSeasonClosed: boolean
}

export function Item({
  item: { id, name, description, value, photoUrl },
  availablePoints,
  isSeasonClosed,
}: ItemProps) {
  const { student } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const isPointsInsufficient = value > availablePoints
  const isRedeemDisabled = isSeasonClosed || isPointsInsufficient

  const remainingPoints = availablePoints - value

  async function handleRedeem() {
    if (!student) return

    setIsPending(true)

    try {
      await createRedemption({
        params: {
          schoolSlug: student.school.slug,
        },
        body: {
          awardId: id,
        },
      })

      toast.success('Solicitação de resgate criada com sucesso!')
      setIsOpen(false)

      // Invalidate queries to refresh balance and shop state
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] })
      queryClient.invalidateQueries({
        queryKey: ['school', 'shop', student.school.id],
      })
      queryClient.invalidateQueries({ queryKey: ['student', 'redemptions'] })
    } catch (error) {
      if (error instanceof HTTPError) {
        const { message } = await error.response.json()
        toast.error(message)
      } else {
        toast.error('Erro ao solicitar resgate. Tente novamente.')
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div className="bg-muted col-span-1 flex flex-col gap-4 rounded-xl border-t-4 border-emerald-400 p-4">
        {photoUrl ? (
          <img
            src={photoUrl || undefined}
            alt={name}
            className="bg-background h-48 rounded-md border object-contain"
          />
        ) : (
          <div className="bg-background flex h-48 items-center justify-center rounded-md border">
            <Award className="text-muted-foreground size-20 stroke-[0.25]" />
          </div>
        )}

        <div className="flex flex-1 flex-col items-center gap-3 text-center">
          <div>
            <h2 className="text-foreground text-sm font-semibold">{name}</h2>
            <span className="text-xs font-semibold text-emerald-500">
              {value} pontos
            </span>
          </div>

          <p className="text-muted-foreground w-full truncate text-xs">
            {description}
          </p>
        </div>

        <Button
          className="disabled:bg-muted-foreground/20 cursor-pointer bg-emerald-500 hover:bg-emerald-600"
          disabled={isRedeemDisabled}
          onClick={() => setIsOpen(true)}
        >
          {isPointsInsufficient ? 'Pontos insuficientes' : 'Resgatar prêmio'}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Resgate</DialogTitle>
            <DialogDescription>
              Você está prestes a solicitar o resgate do prêmio{' '}
              <strong>{name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="text-foreground space-y-4 py-4 text-sm">
            <div className="border-border bg-muted space-y-2 rounded-lg border p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Prêmio selecionado:
                </span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="border-border/50 flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Custo do prêmio:</span>
                <span className="font-semibold text-emerald-500">
                  {value} pontos
                </span>
              </div>
              <div className="border-border/50 flex justify-between border-t pt-2">
                <span className="text-muted-foreground">
                  Seu saldo disponível:
                </span>
                <span className="font-semibold">{availablePoints} pontos</span>
              </div>
              <div className="border-border/50 flex justify-between border-t pt-2">
                <span className="text-muted-foreground">
                  Saldo após resgate:
                </span>
                <span className="font-semibold text-emerald-600">
                  {remainingPoints} pontos
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-600">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p className="leading-normal">
                Importante: A administração da sua escola precisará aprovar este
                resgate. Seus pontos serão{' '}
                <strong>reservados imediatamente</strong> e deduzidos do seu
                saldo. Caso a solicitação seja cancelada ou rejeitada, os pontos
                serão devolvidos.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRedeem}
              disabled={isPending}
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Confirmar Resgate'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
