import { basePrisma } from './prisma'

export async function recordAuditLog(data: {
  schoolId?: string | null
  actorId?: string | null
  actorType: 'USER' | 'STUDENT' | 'SYSTEM'
  entityType: string
  entityId?: string | null
  action: string
  description: string
  oldData?: unknown
  newData?: unknown
  metadata?: unknown
  ipAddress?: string | null
  userAgent?: string | null
}) {
  try {
    return await basePrisma.auditLog.create({
      data: {
        schoolId: data.schoolId,
        actorId: data.actorId,
        actorType: data.actorType,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        description: data.description,
        oldData: data.oldData ? JSON.parse(JSON.stringify(data.oldData)) : null,
        newData: data.newData ? JSON.parse(JSON.stringify(data.newData)) : null,
        metadata: data.metadata
          ? JSON.parse(JSON.stringify(data.metadata))
          : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    })
  } catch (err) {
    console.error('Failed to save manual audit log:', err)
  }
}

export function mapOperationToAction(
  model: string,
  operation: string,
  result: unknown,
): string {
  const res = result as Record<string, unknown> | null | undefined
  if (model === 'Point' && operation === 'create') {
    return 'SCORE'
  }
  if (model === 'RewardRedemption' && operation === 'update') {
    if (res?.status === 'APPROVED') return 'APPROVE'
    if (res?.status === 'REJECTED') return 'REJECT'
    if (res?.status === 'CANCELLED') return 'CANCEL'
    if (res?.status === 'DELIVERED') return 'DELIVER'
  }
  if (model === 'SchoolSeason') {
    if (operation === 'create') return 'CREATE'
    if (operation === 'update') {
      if (res?.status === 'FINISHED') return 'CLOSE'
      if (res?.status === 'ACTIVE') return 'REOPEN'
    }
  }
  if (model === 'ExchangeSeason') {
    if (operation === 'create') return 'CREATE'
    if (operation === 'update') {
      if (res?.status === 'CLOSED') return 'CLOSE'
      if (res?.status === 'OPEN') return 'REOPEN'
    }
  }

  // Fallbacks
  if (operation === 'create' || operation === 'createMany') return 'CREATE'
  if (operation === 'update' || operation === 'updateMany') return 'UPDATE'
  if (operation === 'delete' || operation === 'deleteMany') return 'DELETE'
  return operation.toUpperCase()
}

export function buildDescription(
  model: string,
  operation: string,
  oldData: unknown,
  newData: unknown,
): string {
  const old = oldData as Record<string, unknown> | null | undefined
  const newD = newData as Record<string, unknown> | null | undefined
  const name =
    newD?.name ||
    old?.name ||
    newD?.title ||
    old?.title ||
    newD?.id ||
    old?.id ||
    ''
  const displayModel = translateModel(model)

  if (model === 'Point' && operation === 'create') {
    return `Realizou pontuação para o aluno (ID: ${newD?.studentId}) no valor de ${newD?.amount} pontos.`
  }

  if (model === 'RewardRedemption' && operation === 'update') {
    const status = newD?.status
    const studentId = newD?.studentId
    if (status === 'APPROVED') {
      return `Aprovou o resgate do prêmio (ID: ${newD?.awardId}) para o aluno (ID: ${studentId}).`
    }
    if (status === 'REJECTED') {
      return `Rejeitou o resgate do prêmio (ID: ${newD?.awardId}) para o aluno (ID: ${studentId}). Motivo: ${newD?.rejectionReason || 'Não informado'}.`
    }
    if (status === 'CANCELLED') {
      return `Cancelou o resgate do prêmio (ID: ${newD?.awardId}) para o aluno (ID: ${studentId}).`
    }
    if (status === 'DELIVERED') {
      return `Entregou o prêmio (ID: ${newD?.awardId}) para o aluno (ID: ${studentId}).`
    }
  }

  switch (operation) {
    case 'create':
      return `Criou ${displayModel} "${name}".`
    case 'update':
      return `Atualizou ${displayModel} "${name}".`
    case 'delete':
      return `Excluiu ${displayModel} "${name}".`
    default:
      return `${operation.toUpperCase()} no modelo ${model}.`
  }
}

function translateModel(model: string): string {
  switch (model) {
    case 'User':
      return 'usuário'
    case 'Student':
      return 'aluno'
    case 'Class':
      return 'turma'
    case 'School':
      return 'escola'
    case 'Member':
      return 'membro'
    case 'Invite':
      return 'convite'
    case 'Point':
      return 'pontuação'
    case 'Item':
      return 'material reciclável'
    case 'Award':
      return 'prêmio'
    case 'ExchangeSeason':
      return 'temporada de troca'
    case 'RewardRedemption':
      return 'resgate de prêmio'
    case 'SchoolSeason':
      return 'ciclo de pontuação'
    default:
      return model.toLowerCase()
  }
}
