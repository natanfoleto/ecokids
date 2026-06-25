import { keepPreviousData, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useState } from 'react'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMetadataSchool } from '@/hooks/use-metadata'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getAuditLogs } from '@/http/audit-logs/get-audit-logs'

import { Tabs } from '../tabs'

export function AuditLogs() {
  useMetadataSchool('Auditoria')
  const schoolSlug = useCurrentSchoolSlug()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const [period, setPeriod] = useState<string>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [action, setAction] = useState<string>('all')
  const [entityType, setEntityType] = useState<string>('all')
  const [actorType, setActorType] = useState<string>('all')

  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'schools',
      schoolSlug,
      'audit-logs',
      {
        page,
        search: appliedSearch,
        period,
        startDate,
        endDate,
        action,
        entityType,
        actorType,
      },
    ],
    queryFn: async () => {
      return await getAuditLogs({
        params: { schoolSlug: schoolSlug! },
        query: {
          page,
          limit: 15,
          search: appliedSearch || undefined,
          period: period !== 'all' ? period : undefined,
          startDate: period === 'custom' && startDate ? startDate : undefined,
          endDate: period === 'custom' && endDate ? endDate : undefined,
          action: action !== 'all' ? action : undefined,
          entityType: entityType !== 'all' ? entityType : undefined,
          actorType: actorType !== 'all' ? actorType : undefined,
        },
      })
    },
    placeholderData: keepPreviousData,
  })

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setAppliedSearch(search)
    setPage(1)
  }

  function handleResetFilters() {
    setSearch('')
    setAppliedSearch('')
    setPeriod('all')
    setStartDate('')
    setEndDate('')
    setAction('all')
    setEntityType('all')
    setActorType('all')
    setPage(1)
    setExpandedRow(null)
  }

  function toggleExpandRow(rowId: string) {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

  function translateModel(model: string): string {
    switch (model) {
      case 'User':
        return 'Usuário'
      case 'Student':
        return 'Aluno'
      case 'Class':
        return 'Turma'
      case 'School':
        return 'Escola'
      case 'Member':
        return 'Membro'
      case 'Invite':
        return 'Convite'
      case 'Point':
        return 'Pontuação'
      case 'Item':
        return 'Item'
      case 'Award':
        return 'Prêmio'
      case 'ExchangeSeason':
        return 'Temporada de Troca'
      case 'RewardRedemption':
        return 'Resgate'
      case 'SchoolSeason':
        return 'Ciclo de Pontuação'
      case 'Security':
        return 'Segurança'
      default:
        return model
    }
  }

  function getActionBadgeStyle(act: string): string {
    switch (act) {
      case 'CREATE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
      case 'LOGIN':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300'
      case 'AUTH_FAILURE':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold'
      case 'SECURITY_VIOLATION':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold border border-red-300'
      case 'SCORE':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
      case 'APPROVE':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
      case 'REJECT':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-850 dark:text-neutral-300'
    }
  }

  return (
    <div className="w-full space-y-6">
      <Tabs />

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Logs de Auditoria</h1>
        <p className="text-muted-foreground text-sm font-light">
          Rastreamento completo das alterações críticas, acessos e segurança da
          plataforma.
        </p>
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-3 -translate-y-1/2" />
              <Input
                className="pl-8"
                placeholder="Buscar por descrição, ação ou ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Actor Type */}
            <Select value={actorType} onValueChange={setActorType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo de Autor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Autores</SelectItem>
                <SelectItem value="USER">Usuário (Manager)</SelectItem>
                <SelectItem value="STUDENT">Aluno (Viewer)</SelectItem>
                <SelectItem value="SYSTEM">Sistema (Automações)</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Select */}
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Ação executada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Ações</SelectItem>
                <SelectItem value="CREATE">CREATE (Criação)</SelectItem>
                <SelectItem value="UPDATE">UPDATE (Edição)</SelectItem>
                <SelectItem value="DELETE">DELETE (Remoção)</SelectItem>
                <SelectItem value="LOGIN">LOGIN (Acesso)</SelectItem>
                <SelectItem value="AUTH_FAILURE">
                  AUTH_FAILURE (Falha de Login)
                </SelectItem>
                <SelectItem value="SCORE">SCORE (Pontuar)</SelectItem>
                <SelectItem value="APPROVE">
                  APPROVE (Aprovar resgate)
                </SelectItem>
                <SelectItem value="REJECT">
                  REJECT (Rejeitar resgate)
                </SelectItem>
                <SelectItem value="SECURITY_VIOLATION">
                  SECURITY_VIOLATION (Violação de segurança)
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Entity Select */}
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Entidade afetada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Entidades</SelectItem>
                <SelectItem value="User">Usuário</SelectItem>
                <SelectItem value="Student">Aluno</SelectItem>
                <SelectItem value="Class">Turma</SelectItem>
                <SelectItem value="School">Escola</SelectItem>
                <SelectItem value="Member">Membro</SelectItem>
                <SelectItem value="Invite">Convite</SelectItem>
                <SelectItem value="Point">Pontuação</SelectItem>
                <SelectItem value="Item">Material Reciclável</SelectItem>
                <SelectItem value="Award">Prêmio</SelectItem>
                <SelectItem value="ExchangeSeason">
                  Temporada de Troca
                </SelectItem>
                <SelectItem value="RewardRedemption">
                  Resgate de Prêmio
                </SelectItem>
                <SelectItem value="SchoolSeason">Ciclo de Pontuação</SelectItem>
                <SelectItem value="Security">Segurança</SelectItem>
              </SelectContent>
            </Select>

            {/* Period Filters */}
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo Histórico</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                <SelectItem value="custom">Período customizado</SelectItem>
              </SelectContent>
            </Select>

            {period === 'custom' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar className="text-muted-foreground absolute left-2.5 top-1/2 size-3 -translate-y-1/2" />
                  <Input
                    type="date"
                    className="w-[150px] pl-8 text-xs"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground text-xs">até</span>
                <div className="relative">
                  <Calendar className="text-muted-foreground absolute left-2.5 top-1/2 size-3 -translate-y-1/2" />
                  <Input
                    type="date"
                    className="w-[150px] pl-8 text-xs"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResetFilters}
              className="cursor-pointer"
            >
              <RefreshCw className="size-3" />
              Limpar
            </Button>
            <Button type="submit" variant="outline" className="cursor-pointer">
              <Filter className="size-3" />
              Aplicar filtros
            </Button>
          </div>
        </form>

        {isError && (
          <p className="text-sm text-red-500">
            Ocorreu um erro ao carregar os logs. Por favor, tente novamente mais
            tarde.
          </p>
        )}

        {/* Audit Log Table */}
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Data/Hora</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead className="w-[100px]">Origem</TableHead>
                <TableHead className="w-[140px]">Ação</TableHead>
                <TableHead className="w-[140px]">Entidade</TableHead>
                <TableHead className="w-[120px]">ID do Alvo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <AuditRowSkeleton />
                  <AuditRowSkeleton />
                  <AuditRowSkeleton />
                </>
              ) : (
                data?.auditLogs.map((log) => (
                  <>
                    <TableRow
                      key={log.id}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleExpandRow(log.id)}
                    >
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {dayjs(log.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {log.actor?.name ||
                              (log.actorType === 'SYSTEM'
                                ? 'Sistema'
                                : 'Desconhecido')}
                          </span>
                          {log.actor?.email && (
                            <span className="text-muted-foreground text-[10px]">
                              {log.actor.email}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground font-mono text-xs uppercase">
                          {log.actorType === 'USER'
                            ? 'Manager'
                            : log.actorType === 'STUDENT'
                              ? 'Viewer'
                              : 'System'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] tracking-wider ${getActionBadgeStyle(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {translateModel(log.entityType)}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {log.entityId ? (
                          <span
                            className="block max-w-[100px] truncate"
                            title={log.entityId}
                          >
                            {log.entityId.substring(0, 8)}...
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell
                        className="max-w-xs truncate text-sm"
                        title={log.description}
                      >
                        {log.description}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpandRow(log.id)
                          }}
                        >
                          {expandedRow === log.id ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {expandedRow === log.id && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={8} className="p-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Git Diff Column */}
                            <div className="space-y-1.5 md:col-span-2">
                              <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider">
                                Alterações no Payload (Git Diff)
                              </span>
                              <div className="bg-muted/30 max-h-80 max-w-full overflow-auto rounded-md border p-3 font-mono text-[11px] leading-relaxed">
                                {(() => {
                                  const oldStr = log.oldData
                                    ? JSON.stringify(log.oldData, null, 2)
                                    : ''
                                  const newStr = log.newData
                                    ? JSON.stringify(log.newData, null, 2)
                                    : ''

                                  if (!oldStr && !newStr) {
                                    return (
                                      <span className="text-muted-foreground font-light">
                                        Nenhum payload gravado.
                                      </span>
                                    )
                                  }

                                  const diffLines = computeDiff(oldStr, newStr)

                                  return diffLines.map((line, idx) => {
                                    let bgColor = ''
                                    let textColor = ''
                                    let prefix = ' '

                                    if (line.type === 'added') {
                                      bgColor =
                                        'bg-emerald-500/10 dark:bg-emerald-500/5'
                                      textColor =
                                        'text-emerald-600 dark:text-emerald-400 font-medium'
                                      prefix = '+'
                                    } else if (line.type === 'removed') {
                                      bgColor =
                                        'bg-rose-500/10 dark:bg-rose-500/5'
                                      textColor =
                                        'text-rose-600 dark:text-rose-400 font-medium'
                                      prefix = '-'
                                    } else {
                                      textColor = 'text-muted-foreground'
                                    }

                                    return (
                                      <div
                                        key={idx}
                                        className={`flex select-none items-start rounded-sm px-1 py-0.5 ${bgColor} ${textColor}`}
                                      >
                                        <span className="w-4 shrink-0 select-none font-bold opacity-50">
                                          {prefix}
                                        </span>
                                        <span className="whitespace-pre-wrap break-all">
                                          {line.value}
                                        </span>
                                      </div>
                                    )
                                  })
                                })()}
                              </div>
                            </div>

                            {/* Extra Info Column */}
                            <div className="space-y-1.5">
                              <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider">
                                Informações Extras & Rede
                              </span>
                              <pre className="bg-muted/30 max-h-80 max-w-full overflow-auto rounded-md border p-3 font-mono text-[11px] leading-relaxed">
                                {JSON.stringify(
                                  {
                                    metadata: log.metadata,
                                    ipAddress: log.ipAddress,
                                    userAgent: log.userAgent,
                                  },
                                  null,
                                  2,
                                )}
                              </pre>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>

          {data?.auditLogs.length === 0 && (
            <p className="text-muted-foreground p-8 text-center text-sm font-light">
              Nenhum registro de auditoria condizente com os filtros informados.
            </p>
          )}
        </div>

        {/* Pagination */}
        {data?.meta && data.meta.totalCount > 0 && (
          <Pagination
            page={page}
            limit={data.meta.limit}
            totalCount={data.meta.totalCount}
            pageCount={data.meta.pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  )
}

function AuditRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-6 w-28" />
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-14" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-12" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-6 rounded-full" />
      </TableCell>
    </TableRow>
  )
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  value: string
}

function computeDiff(oldStr: string, newStr: string): DiffLine[] {
  const oldLines = oldStr ? oldStr.split('\n') : []
  const newLines = newStr ? newStr.split('\n') : []

  if (oldLines.length === 0) {
    return newLines.map((line) => ({ type: 'added', value: line }))
  }
  if (newLines.length === 0) {
    return oldLines.map((line) => ({ type: 'removed', value: line }))
  }

  const n = oldLines.length
  const m = newLines.length
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0),
  )

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const diff: DiffLine[] = []
  let i = n
  let j = m

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diff.unshift({ type: 'unchanged', value: oldLines[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'added', value: newLines[j - 1] })
      j--
    } else {
      diff.unshift({ type: 'removed', value: oldLines[i - 1] })
      i--
    }
  }

  return diff
}
