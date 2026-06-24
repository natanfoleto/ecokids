import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  Ban,
  Check,
  ClipboardCheck,
  Clock,
  Filter,
  Gift,
  Loader2,
  Search,
  X,
} from 'lucide-react'
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
import { cn } from '@/lib/utils'

import { Tabs } from '../tabs'
import { Pagination } from '@/components/pagination'
import {
  approveRedemptionAction,
  deliverRedemptionAction,
  rejectRedemptionAction,
} from './actions'

export function Redemptions() {
  useMetadataSchool('Resgate de Prêmios')
  const schoolSlug = useCurrentSchoolSlug()

  const [activeTab, setActiveTab] = useState('pending')

  const [approveRedemptionId, setApproveRedemptionId] = useState<string | null>(
    null,
  )
  const [pickupInstructions, setPickupInstructions] = useState('')

  const [rejectRedemptionId, setRejectRedemptionId] = useState<string | null>(
    null,
  )
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionError, setRejectionError] = useState('')

  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const [pendingPage, setPendingPage] = useState(1)
  const [approvedPage, setApprovedPage] = useState(1)
  const [deliveredPage, setDeliveredPage] = useState(1)
  const [otherPage, setOtherPage] = useState(1)

  const pendingQuery = useQuery({
    queryKey: ['schools', schoolSlug, 'redemptions', { status: 'PENDING', page: pendingPage, search: appliedSearch }],
    queryFn: async () => {
      return getRedemptions({
        params: { schoolSlug: schoolSlug! },
        query: { status: 'PENDING', page: pendingPage, limit: 10, search: appliedSearch || undefined },
      })
    },
    placeholderData: keepPreviousData,
    enabled: !!schoolSlug,
  })

  const approvedQuery = useQuery({
    queryKey: ['schools', schoolSlug, 'redemptions', { status: 'APPROVED', page: approvedPage, search: appliedSearch }],
    queryFn: async () => {
      return getRedemptions({
        params: { schoolSlug: schoolSlug! },
        query: { status: 'APPROVED', page: approvedPage, limit: 10, search: appliedSearch || undefined },
      })
    },
    placeholderData: keepPreviousData,
    enabled: !!schoolSlug,
  })

  const deliveredQuery = useQuery({
    queryKey: ['schools', schoolSlug, 'redemptions', { status: 'DELIVERED', page: deliveredPage, search: appliedSearch }],
    queryFn: async () => {
      return getRedemptions({
        params: { schoolSlug: schoolSlug! },
        query: { status: 'DELIVERED', page: deliveredPage, limit: 10, search: appliedSearch || undefined },
      })
    },
    placeholderData: keepPreviousData,
    enabled: !!schoolSlug,
  })

  const otherQuery = useQuery({
    queryKey: ['schools', schoolSlug, 'redemptions', { status: 'REJECTED,CANCELLED', page: otherPage, search: appliedSearch }],
    queryFn: async () => {
      return getRedemptions({
        params: { schoolSlug: schoolSlug! },
        query: { status: 'REJECTED,CANCELLED', page: otherPage, limit: 10, search: appliedSearch || undefined },
      })
    },
    placeholderData: keepPreviousData,
    enabled: !!schoolSlug,
  })

  const isLoading =
    pendingQuery.isLoading ||
    approvedQuery.isLoading ||
    deliveredQuery.isLoading ||
    otherQuery.isLoading

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

  const pending = pendingQuery.data?.redemptions ?? []
  const pendingMeta = pendingQuery.data?.meta

  const approved = approvedQuery.data?.redemptions ?? []
  const approvedMeta = approvedQuery.data?.meta

  const delivered = deliveredQuery.data?.redemptions ?? []
  const deliveredMeta = deliveredQuery.data?.meta

  const other = otherQuery.data?.redemptions ?? []
  const otherMeta = otherQuery.data?.meta

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setAppliedSearch(search)
    setPendingPage(1)
    setApprovedPage(1)
    setDeliveredPage(1)
    setOtherPage(1)
  }

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

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2" />
          <Input
            className="pl-8"
            placeholder="Buscar por aluno ou prêmio"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button type="submit" variant="outline" className="cursor-pointer">
          <Filter className="size-3" />
          Aplicar filtros
        </Button>
      </form>

      <ContentTabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid h-auto w-full grid-cols-1 gap-4 bg-transparent p-0 sm:grid-cols-2 lg:grid-cols-4">
          <TabsTrigger
            value="pending"
            className={cn(
              'border-border bg-card flex h-auto w-full cursor-pointer select-none flex-col items-start gap-2 rounded-xl border p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md',
              activeTab === 'pending'
                ? 'border-amber-500/50 bg-amber-500/5 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                : 'text-muted-foreground hover:bg-muted/40',
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  activeTab === 'pending'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-muted-foreground',
                )}
              >
                Pendentes
              </span>
              <div
                className={cn(
                  'rounded-lg border p-1.5 transition-colors',
                  activeTab === 'pending'
                    ? 'border-amber-500/30 bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'border-border bg-muted/50 text-muted-foreground',
                )}
              >
                <Clock className="size-4" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {pendingMeta?.totalCount ?? 0}
              </span>
              <span className="text-muted-foreground text-xs font-light">
                solicitações
              </span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="approved"
            className={cn(
              'border-border bg-card flex h-auto w-full cursor-pointer select-none flex-col items-start gap-2 rounded-xl border p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md',
              activeTab === 'approved'
                ? 'border-blue-500/50 bg-blue-500/5 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                : 'text-muted-foreground hover:bg-muted/40',
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  activeTab === 'approved'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-muted-foreground',
                )}
              >
                Aprovados
              </span>
              <div
                className={cn(
                  'rounded-lg border p-1.5 transition-colors',
                  activeTab === 'approved'
                    ? 'border-blue-500/30 bg-blue-500/20 text-blue-600 dark:text-blue-400'
                    : 'border-border bg-muted/50 text-muted-foreground',
                )}
              >
                <Check className="size-4" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {approvedMeta?.totalCount ?? 0}
              </span>
              <span className="text-muted-foreground text-xs font-light">
                solicitações
              </span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="delivered"
            className={cn(
              'border-border bg-card flex h-auto w-full cursor-pointer select-none flex-col items-start gap-2 rounded-xl border p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md',
              activeTab === 'delivered'
                ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                : 'text-muted-foreground hover:bg-muted/40',
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  activeTab === 'delivered'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground',
                )}
              >
                Entregues
              </span>
              <div
                className={cn(
                  'rounded-lg border p-1.5 transition-colors',
                  activeTab === 'delivered'
                    ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'border-border bg-muted/50 text-muted-foreground',
                )}
              >
                <ClipboardCheck className="size-4" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {deliveredMeta?.totalCount ?? 0}
              </span>
              <span className="text-muted-foreground text-xs font-light">
                solicitações
              </span>
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="other"
            className={cn(
              'border-border bg-card flex h-auto w-full cursor-pointer select-none flex-col items-start gap-2 rounded-xl border p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md',
              activeTab === 'other'
                ? 'border-red-500/50 bg-red-500/5 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                : 'text-muted-foreground hover:bg-muted/40',
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider',
                  activeTab === 'other'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground',
                )}
              >
                Rejeitados / Cancelados
              </span>
              <div
                className={cn(
                  'rounded-lg border p-1.5 transition-colors',
                  activeTab === 'other'
                    ? 'border-red-500/30 bg-red-500/20 text-red-600 dark:text-red-400'
                    : 'border-border bg-muted/50 text-muted-foreground',
                )}
              >
                <Ban className="size-4" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {otherMeta?.totalCount ?? 0}
              </span>
              <span className="text-muted-foreground text-xs font-light">
                solicitações
              </span>
            </div>
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
            <div className="space-y-4">
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
                            <Check className="size-4" />
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
                            <X className="size-4" />
                            Rejeitar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pendingMeta && pendingMeta.pageCount > 1 && (
                <Pagination
                  page={pendingPage}
                  limit={pendingMeta.limit}
                  totalCount={pendingMeta.totalCount}
                  pageCount={pendingMeta.pageCount}
                  onPageChange={setPendingPage}
                />
              )}
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
            <div className="space-y-4">
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
                            <ClipboardCheck className="size-4" />
                            Entregar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {approvedMeta && approvedMeta.pageCount > 1 && (
                <Pagination
                  page={approvedPage}
                  limit={approvedMeta.limit}
                  totalCount={approvedMeta.totalCount}
                  pageCount={approvedMeta.pageCount}
                  onPageChange={setApprovedPage}
                />
              )}
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
            <div className="space-y-4">
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

              {deliveredMeta && deliveredMeta.pageCount > 1 && (
                <Pagination
                  page={deliveredPage}
                  limit={deliveredMeta.limit}
                  totalCount={deliveredMeta.totalCount}
                  pageCount={deliveredMeta.pageCount}
                  onPageChange={setDeliveredPage}
                />
              )}
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
            <div className="space-y-4">
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

              {otherMeta && otherMeta.pageCount > 1 && (
                <Pagination
                  page={otherPage}
                  limit={otherMeta.limit}
                  totalCount={otherMeta.totalCount}
                  pageCount={otherMeta.pageCount}
                  onPageChange={setOtherPage}
                />
              )}
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
