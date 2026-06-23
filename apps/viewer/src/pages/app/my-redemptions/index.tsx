import { useQuery } from '@tanstack/react-query'
import { Ban, CheckCircle2, Clock, Gift, Loader2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth'
import { useMetadata } from '@/hooks/use-metadata'
import { cancelRedemption } from '@/http/viewers/cancel-redemption'
import { getStudentRedemptions } from '@/http/viewers/get-student-redemptions'
import { queryClient } from '@/lib/react-query'

export function MyRedemptions() {
  useMetadata('Ecokids - Meus Resgates')
  const { student } = useAuth()
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['student', 'redemptions'],
    queryFn: getStudentRedemptions,
  })

  async function handleCancel(redemptionId: string) {
    setCancellingId(redemptionId)

    try {
      await cancelRedemption({
        params: { redemptionId },
      })

      toast.success('Solicitação de resgate cancelada com sucesso!')

      // Invalidate queries to refresh balance and list
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] })
      queryClient.invalidateQueries({ queryKey: ['student', 'redemptions'] })
      if (student) {
        queryClient.invalidateQueries({
          queryKey: ['school', 'shop', student.school.id],
        })
      }
    } catch (error) {
      toast.error('Erro ao cancelar solicitação. Tente novamente.')
    } finally {
      setCancellingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    )
  }

  const redemptions = data?.redemptions ?? []

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-xl font-bold tracking-tight">
            Meus Resgates
          </h1>
          <p className="text-muted-foreground text-xs font-light">
            Acompanhe o status dos prêmios que você solicitou.
          </p>
        </div>

        <Button variant="outline" size="sm" asChild className="cursor-pointer">
          <Link to="/shop">Ir para a Loja</Link>
        </Button>
      </div>

      {redemptions.length === 0 ? (
        <div className="border-border space-y-4 rounded-xl border border-dashed p-12 text-center">
          <Gift className="text-muted-foreground mx-auto size-12 opacity-40" />
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">
              Você ainda não solicitou nenhum prêmio.
            </p>
            <p className="text-muted-foreground text-xs">
              Vá até a loja do app e use seus pontos acumulados!
            </p>
          </div>
          <Button
            size="sm"
            asChild
            className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
          >
            <Link to="/shop">Ver prêmios</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {redemptions.map((redemption) => {
            const isPending = redemption.status === 'PENDING'
            const isApproved = redemption.status === 'APPROVED'
            const isDelivered = redemption.status === 'DELIVERED'
            const isRejected = redemption.status === 'REJECTED'
            const isCancelled = redemption.status === 'CANCELLED'

            return (
              <div
                key={redemption.id}
                className="border-border bg-muted flex flex-col gap-3 rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-foreground text-sm font-semibold">
                      {redemption.award.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-500">
                      {redemption.pointsCost} pontos
                    </p>
                    <p className="text-muted-foreground text-[10px]">
                      Solicitado em:{' '}
                      {new Date(redemption.createdAt).toLocaleDateString(
                        'pt-BR',
                      )}
                    </p>
                  </div>

                  {isPending && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                      <Clock className="size-3" />
                      Pendente
                    </span>
                  )}

                  {isApproved && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      <CheckCircle2 className="size-3" />
                      Aprovado
                    </span>
                  )}

                  {isDelivered && (
                    <span className="bg-muted text-muted-foreground border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                      Entregue
                    </span>
                  )}

                  {isRejected && (
                    <span className="bg-destructive/10 text-destructive border-destructive/20 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                      <Ban className="size-3" />
                      Rejeitado
                    </span>
                  )}

                  {isCancelled && (
                    <span className="bg-muted text-muted-foreground border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                      Cancelado
                    </span>
                  )}
                </div>

                {isApproved && redemption.pickupInstructions && (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-700">
                    <p className="mb-0.5 font-semibold">
                      Instruções de Retirada:
                    </p>
                    <p className="leading-relaxed opacity-95">
                      {redemption.pickupInstructions}
                    </p>
                  </div>
                )}

                {isRejected && redemption.rejectionReason && (
                  <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-lg border p-3 text-xs">
                    <p className="mb-0.5 font-semibold">
                      Justificativa da Rejeição:
                    </p>
                    <p className="leading-relaxed opacity-95">
                      {redemption.rejectionReason}
                    </p>
                  </div>
                )}

                {isPending && (
                  <div className="border-border/50 flex items-center justify-between gap-4 border-t pt-3">
                    <p className="text-muted-foreground max-w-sm text-[10px] leading-normal">
                      Você pode cancelar esta solicitação pendente para
                      recuperar seus pontos reservados.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={cancellingId === redemption.id}
                      onClick={() => handleCancel(redemption.id)}
                      className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive shrink-0 cursor-pointer text-xs"
                    >
                      {cancellingId === redemption.id ? (
                        <Loader2 className="mr-1 size-3.5 animate-spin" />
                      ) : (
                        <Undo2 className="mr-1 size-3.5" />
                      )}
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
