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
    <div className="flex min-h-screen w-full flex-col gap-6 p-4">
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
        <div className="space-y-4 rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/20 p-12 text-center shadow-sm">
          <Gift className="mx-auto size-12 text-emerald-400 opacity-70" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-700">
              Você ainda não solicitou nenhum prêmio.
            </p>
            <p className="text-xs font-medium text-gray-500">
              Vá até a loja do app e use seus pontos acumulados!
            </p>
          </div>
          <Button
            size="sm"
            asChild
            className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-white shadow-md shadow-emerald-100 transition-all hover:from-emerald-600 hover:to-teal-600 active:scale-95"
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
                className="flex flex-col gap-3 rounded-2xl border-2 border-emerald-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <h3 className="text-sm font-bold leading-snug text-gray-800">
                      {redemption.award.name}
                    </h3>
                    <p className="text-xs font-bold text-emerald-500">
                      {redemption.pointsCost} pontos
                    </p>
                    <p className="text-[10px] font-medium text-gray-400">
                      Solicitado em:{' '}
                      {new Date(redemption.createdAt).toLocaleDateString(
                        'pt-BR',
                      )}
                    </p>
                  </div>

                  {isPending && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                      <Clock className="size-3" />
                      Pendente
                    </span>
                  )}

                  {isApproved && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="size-3" />
                      Aprovado
                    </span>
                  )}

                  {isDelivered && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold text-gray-500">
                      Entregue
                    </span>
                  )}

                  {isRejected && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                      <Ban className="size-3" />
                      Rejeitado
                    </span>
                  )}

                  {isCancelled && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold text-gray-500">
                      Cancelado
                    </span>
                  )}
                </div>

                {isApproved && redemption.pickupInstructions && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-3 text-left text-xs text-emerald-800">
                    <p className="mb-0.5 font-bold">Instruções de Retirada:</p>
                    <p className="font-medium leading-relaxed">
                      {redemption.pickupInstructions}
                    </p>
                  </div>
                )}

                {isRejected && redemption.rejectionReason && (
                  <div className="rounded-xl border border-red-200 bg-red-50/30 p-3 text-left text-xs text-red-800">
                    <p className="mb-0.5 font-bold">
                      Justificativa da Rejeição:
                    </p>
                    <p className="font-medium leading-relaxed">
                      {redemption.rejectionReason}
                    </p>
                  </div>
                )}

                {isPending && (
                  <div className="flex items-center justify-between gap-4 border-t border-emerald-50 pt-3">
                    <p className="text-left text-[10px] font-medium leading-normal text-gray-400">
                      Você pode cancelar esta solicitação pendente para
                      recuperar seus pontos reservados.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={cancellingId === redemption.id}
                      onClick={() => handleCancel(redemption.id)}
                      className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border-2 border-red-100 px-4 text-xs font-semibold text-red-600 transition-all hover:bg-red-50 hover:text-red-700 active:scale-95"
                    >
                      {cancellingId === redemption.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Undo2 className="size-3.5" />
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
