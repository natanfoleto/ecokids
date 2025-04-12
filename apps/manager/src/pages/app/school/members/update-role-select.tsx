import type { Role } from '@ecokids/auth'
import type { ComponentProps } from 'react'

import { FormSelect } from '@/components/form/form-select'
import { Select, SelectItem } from '@/components/ui/select'
import { useCurrentSchool } from '@/hooks/use-current-school'

import { updateMemberAction } from './actions'

interface UpdateRoleMemberProps extends ComponentProps<typeof Select> {
  memberId: string
}

export function UpdateRoleMember({
  memberId,
  ...props
}: UpdateRoleMemberProps) {
  const currentSchool = useCurrentSchool()

  async function handleOnValueChange(role: Role) {
    updateMemberAction({
      params: { schoolSlug: currentSchool!, memberId },
      body: {
        role,
      },
    })
  }

  return (
    <FormSelect
      onValueChange={handleOnValueChange}
      {...props}
      className="cursor-pointer"
    >
      <SelectItem value="ADMIN">Admin</SelectItem>
      <SelectItem value="MEMBER">Membro</SelectItem>
    </FormSelect>
  )
}
