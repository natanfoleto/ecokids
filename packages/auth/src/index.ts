import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { Member } from './models/member'
import { permissions } from './permissions'
import { awardSubject } from './subjects/award'
import { classSubject } from './subjects/class'
import { inviteSubject } from './subjects/invite'
import { memberSubject } from './subjects/member'
import { pointSubject } from './subjects/point'
import { schoolSubject } from './subjects/school'
import { studentSubject } from './subjects/student'

export * from './models/school'
export * from './models/member'
export * from './models/class'
export * from './models/student'
export * from './models/point'
export * from './models/award'
export * from './roles'

const appAbilitiesSchema = z.union([
  memberSubject,
  inviteSubject,
  schoolSubject,
  classSubject,
  studentSubject,
  pointSubject,
  awardSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(member: Member) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[member.role] !== 'function') {
    throw new Error(`Permissions for role ${member.role} not found.`)
  }

  permissions[member.role](member, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
