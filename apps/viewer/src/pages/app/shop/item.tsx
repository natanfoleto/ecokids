import type { GetSchoolShopResponse } from '@ecokids/types'
import { toast } from '@ecokids/ui'
import { HTTPError } from 'ky'
import { AlertTriangle, Award, Loader2 } from 'lucide-react'
import { useState } from 'react'

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
      <div className="col-span-1 flex flex-col gap-4 rounded-2xl border-2 border-emerald-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
        {photoUrl ? (
          <img
            src={photoUrl || undefined}
            alt={name}
            className="h-44 w-full rounded-xl border border-emerald-100 bg-emerald-50/30 object-contain"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/50">
            <Award className="size-16 stroke-[1] text-emerald-400" />
          </div>
        )}

        <div className="flex flex-1 flex-col items-center gap-2 text-center">
          <div>
            <h2 className="text-sm font-bold leading-tight text-gray-800">
              {name}
            </h2>
            <span className="mt-1.5 inline-block rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
              {value} pontos
            </span>
          </div>

          <p className="line-clamp-2 w-full text-xs text-gray-500">
            {description}
          </p>
        </div>

        <Button
          className={`h-11 w-full cursor-pointer rounded-xl text-xs font-semibold transition-all active:scale-95 ${
            isRedeemDisabled
              ? 'cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-100 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-200'
          }`}
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
