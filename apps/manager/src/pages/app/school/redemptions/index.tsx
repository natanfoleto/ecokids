import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Ban, Check, ClipboardCheck, Gift, Loader2, X } from 'lucide-react'
import { useState } from 'react'

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs as ContentTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useAction } from '@/hooks/use-actions'
import { useMetadataSchool } from '@/hooks/use-metadata'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getRedemptions } from '@/http/redemptions/get-redemptions'
import { queryClient } from '@/lib/react-query'

import { Tabs } from '../tabs'
import {
  approveRedemptionAction,
  deliverRedemptionAction,
  rejectRedemptionAction,
} from './actions'

export function Redemptions() {
  useMetadataSchool('Resgate de Prêmios')
  const schoolSlug = useCurrentSchoolSlug()

  const [approveRedemptionId, setApproveRedemptionId] = useState<string | null>(
    null,
  )
  const [pickupInstructions, setPickupInstructions] = useState('')

  const [rejectRedemptionId, setRejectRedemptionId] = useState<string | null>(
    null,
  )
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionError, setRejectionError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['schools', schoolSlug, 'redemptions'],
    queryFn: async () => {
      return getRedemptions({
        params: {
          schoolSlug: schoolSlug!,
        },
      })
    },
    placeholderData: keepPreviousData,
    enabled: !!schoolSlug,
  })

  const [, handleApproveAct, isApprovePending] = useAction()
  const [, handleRejectAct, isRejectPending] = useAction()
  const [, handleDeliverAct, isDeliverPending] = useAction()

  async function handleApprove() {
    if (!schoolSlug || !approveRedemptionId) return

    handleApproveAct(
      () =>
        approveRedemptionAction({
          schoolSlug,
          redemptionId: approveRedemptionId,
          pickupInstructions,
        }),
      (data) => {
        if (data.success) {
          setApproveRedemptionId(null)
          setPickupInstructions('')
          queryClient.invalidateQueries({
            queryKey: ['schools', schoolSlug, 'redemptions'],
          })
        }
      },
    )
  }

  async function handleReject() {
    if (!schoolSlug || !rejectRedemptionId) return

    if (!rejectionReason.trim()) {
      setRejectionError('A justificativa é obrigatória para rejeitar.')
      return
    }

    setRejectionError('')

    handleRejectAct(
      () =>
        rejectRedemptionAction({
          schoolSlug,
          redemptionId: rejectRedemptionId,
          rejectionReason,
        }),
      (data) => {
        if (data.success) {
          setRejectRedemptionId(null)
          setRejectionReason('')
          queryClient.invalidateQueries({
            queryKey: ['schools', schoolSlug, 'redemptions'],
          })
        }
      },
    )
  }

  async function handleDeliver(redemptionId: string) {
    if (!schoolSlug) return

    handleDeliverAct(
      () =>
        deliverRedemptionAction({
          schoolSlug,
          redemptionId,
        }),
      (data) => {
        if (data.success) {
          queryClient.invalidateQueries({
            queryKey: ['schools', schoolSlug, 'redemptions'],
          })
        }
      },
    )
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Tabs />
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="text-muted-foreground size-8 animate-spin" />
        </div>
      </div>
    )
  }

  const redemptions = data?.redemptions ?? []

  const pending = redemptions.filter((r) => r.status === 'PENDING')
  const approved = redemptions.filter((r) => r.status === 'APPROVED')
  const delivered = redemptions.filter((r) => r.status === 'DELIVERED')
  const other = redemptions.filter(
    (r) => r.status === 'REJECTED' || r.status === 'CANCELLED',
  )

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Resgate de Prêmios
        </h1>
        <p className="text-muted-foreground text-sm font-light">
          Gerencie e controle as solicitações de troca de pontos por prêmios
          enviadas pelos alunos.
        </p>
      </div>

      <ContentTabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="cursor-pointer">
            Pendentes ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="cursor-pointer">
            Aprovados ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="cursor-pointer">
            Entregues ({delivered.length})
          </TabsTrigger>
          <TabsTrigger value="other" className="cursor-pointer">
            Rejeitados / Cancelados ({other.length})
          </TabsTrigger>
        </TabsList>

        {/* PENDENTES TAB */}
        <TabsContent value="pending" className="space-y-4">
          {pending.length === 0 ? (
            <div className="border-border rounded-lg border border-dashed p-12 text-center">
              <Gift className="text-muted-foreground mx-auto mb-2 size-8 opacity-50" />
              <p className="text-muted-foreground text-sm">
                Nenhuma solicitação de resgate pendente.
              </p>
            </div>
          ) : (
            <div className="border-border overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Prêmio</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-[200px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-medium">
                        {redemption.student.name}
                      </TableCell>
                      <TableCell>
                        {redemption.student.class.name} (
                        {redemption.student.class.year})
                      </TableCell>
                      <TableCell>{redemption.award.name}</TableCell>
                      <TableCell className="font-semibold text-emerald-500">
                        {redemption.pointsCost}
                      </TableCell>
                      <TableCell>
                        {new Date(redemption.createdAt).toLocaleDateString(
                          'pt-BR',
                        )}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setApproveRedemptionId(redemption.id)}
                          className="cursor-pointer border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                        >
                          <Check className="mr-1 size-4" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRejectRedemptionId(redemption.id)
                            setRejectionError('')
                          }}
                          className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                          <X className="mr-1 size-4" />
                          Rejeitar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* APROVADOS TAB */}
        <TabsContent value="approved" className="space-y-4">
          {approved.length === 0 ? (
            <div className="border-border rounded-lg border border-dashed p-12 text-center">
              <Gift className="text-muted-foreground mx-auto mb-2 size-8 opacity-50" />
              <p className="text-muted-foreground text-sm">
                Nenhuma solicitação aprovada aguardando entrega.
              </p>
            </div>
          ) : (
            <div className="border-border overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Prêmio</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Instruções de Retirada</TableHead>
                    <TableHead>Aprovado em</TableHead>
                    <TableHead className="w-[150px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approved.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-medium">
                        {redemption.student.name}
                      </TableCell>
                      <TableCell>
                        {redemption.student.class.name} (
                        {redemption.student.class.year})
                      </TableCell>
                      <TableCell>{redemption.award.name}</TableCell>
                      <TableCell className="font-semibold text-emerald-500">
                        {redemption.pointsCost}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[250px] truncate">
                        {redemption.pickupInstructions || '-'}
                      </TableCell>
                      <TableCell>
                        {redemption.approvedAt
                          ? new Date(redemption.approvedAt).toLocaleDateString(
                              'pt-BR',
                            )
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleDeliver(redemption.id)}
                          disabled={isDeliverPending}
                          className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
                        >
                          <ClipboardCheck className="mr-1 size-4" />
                          Entregar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ENTREGUES TAB */}
        <TabsContent value="delivered" className="space-y-4">
          {delivered.length === 0 ? (
            <div className="border-border rounded-lg border border-dashed p-12 text-center">
              <Gift className="text-muted-foreground mx-auto mb-2 size-8 opacity-50" />
              <p className="text-muted-foreground text-sm">
                Nenhuma entrega realizada.
              </p>
            </div>
          ) : (
            <div className="border-border overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Prêmio</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Solicitado em</TableHead>
                    <TableHead>Entregue em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delivered.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-medium">
                        {redemption.student.name}
                      </TableCell>
                      <TableCell>
                        {redemption.student.class.name} (
                        {redemption.student.class.year})
                      </TableCell>
                      <TableCell>{redemption.award.name}</TableCell>
                      <TableCell className="text-muted-foreground font-semibold">
                        {redemption.pointsCost}
                      </TableCell>
                      <TableCell>
                        {new Date(redemption.createdAt).toLocaleDateString(
                          'pt-BR',
                        )}
                      </TableCell>
                      <TableCell>
                        {redemption.deliveredAt
                          ? new Date(redemption.deliveredAt).toLocaleDateString(
                              'pt-BR',
                            )
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* OUTROS TAB */}
        <TabsContent value="other" className="space-y-4">
          {other.length === 0 ? (
            <div className="border-border rounded-lg border border-dashed p-12 text-center">
              <Gift className="text-muted-foreground mx-auto mb-2 size-8 opacity-50" />
              <p className="text-muted-foreground text-sm">
                Nenhuma solicitação rejeitada ou cancelada.
              </p>
            </div>
          ) : (
            <div className="border-border overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Prêmio</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Motivo / Detalhe</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {other.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-medium">
                        {redemption.student.name}
                      </TableCell>
                      <TableCell>
                        {redemption.student.class.name} (
                        {redemption.student.class.year})
                      </TableCell>
                      <TableCell>{redemption.award.name}</TableCell>
                      <TableCell className="text-muted-foreground font-semibold">
                        {redemption.pointsCost}
                      </TableCell>
                      <TableCell>
                        {redemption.status === 'REJECTED' ? (
                          <span className="text-destructive inline-flex items-center gap-1 text-xs font-medium">
                            <Ban className="size-3" />
                            Rejeitado
                          </span>
                        ) : (
                          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
                            <X className="size-3" />
                            Cancelado pelo Aluno
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">
                        {redemption.status === 'REJECTED'
                          ? redemption.rejectionReason
                          : 'Cancelado pelo próprio estudante.'}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          redemption.rejectedAt ||
                            redemption.cancelledAt ||
                            redemption.createdAt,
                        ).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </ContentTabs>

      {/* APPROVAL DIALOG */}
      <Dialog
        open={!!approveRedemptionId}
        onOpenChange={(open) => !open && setApproveRedemptionId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Solicitação de Resgate</DialogTitle>
            <DialogDescription>
              Você está aprovando o resgate do prêmio deste estudante. O saldo
              de pontos permanecerá consumido.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="pickup-instructions">
              Instruções de Retirada (Opcional)
            </Label>
            <Input
              id="pickup-instructions"
              placeholder="Ex: Retire na diretoria com a coordenadora Maria na sexta-feira."
              value={pickupInstructions}
              onChange={(e) => setPickupInstructions(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isApprovePending}
              onClick={() => setApproveRedemptionId(null)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApprovePending}
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
            >
              {isApprovePending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Confirmar Aprovação'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECTION DIALOG */}
      <Dialog
        open={!!rejectRedemptionId}
        onOpenChange={(open) => !open && setRejectRedemptionId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação de Resgate</DialogTitle>
            <DialogDescription>
              Você está rejeitando o resgate. Isso devolverá os pontos
              reservados imediatamente ao saldo do estudante.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <Label htmlFor="rejection-reason">
              Justificativa da Rejeição (Obrigatório)
            </Label>
            <Input
              id="rejection-reason"
              placeholder="Ex: Saldo incorreto ou prêmio fora de estoque."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value)
                if (e.target.value.trim()) setRejectionError('')
              }}
            />
            {rejectionError && <FormError error={rejectionError} />}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isRejectPending}
              onClick={() => setRejectRedemptionId(null)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejectPending}
              className="cursor-pointer"
            >
              {isRejectPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Rejeitar Solicitação'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
