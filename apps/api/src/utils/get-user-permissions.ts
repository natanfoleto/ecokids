import { defineAbilityFor, memberSchema, type Role } from '@ecokids/auth'

export function getUserPermissions(usuarioId: string, role: Role) {
  const authUsuario = memberSchema.parse({
    id: usuarioId,
    role,
  })

  const ability = defineAbilityFor(authUsuario)

  return ability
}
