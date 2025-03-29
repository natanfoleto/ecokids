import { defineAbilityFor, memberSchema, type Role } from '@ecokids/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = memberSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
