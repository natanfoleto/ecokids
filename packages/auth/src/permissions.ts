import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { Member } from './models/member'
import { Role } from './roles'

type PermissionsByRole = (
  member: Member,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(member, { can }) {
    can('manage', 'all')
    can(['transfer_ownership', 'update'], 'School', {
      ownerId: { $eq: member.id },
    })
  },
  MEMBER(_, { can }) {
    can('get', 'SchoolSeason')

    // Permissions required for Scorer app
    can('get', 'Student') // identify student by code and search by name
    can('get', 'Item') // load the list of recyclable items
    can('create', 'Point') // register a scoring session
  },
}
