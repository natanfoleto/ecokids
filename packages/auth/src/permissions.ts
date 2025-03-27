import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { Member } from './models/member'
import { Role } from './roles'

type PermissionsByRole = (
  member: Member,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(member, { can, cannot }) {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update'], 'Company')
    can(['transfer_ownership', 'update'], 'Company', {
      ownerId: { $eq: member.id },
    })
  },
  MEMBER(_, { can }) {
    can('get', 'Member')
  },
}
