import type { Role } from '@ecokids/auth'
import type { UpdateMemberResponse } from '@ecokids/types'
import type { ComponentProps } from 'react'

import { FormSelect } from '@/components/form/form-select'
import { Select, SelectItem } from '@/components/ui/select'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { queryClient } from '@/lib/react-query'

import { updateMemberAction } from './actions'

interface UpdateRoleMemberProps extends ComponentProps<typeof Select> {
  memberId: string
}

export function UpdateRoleMember({
  memberId,
  ...props
}: UpdateRoleMemberProps) {
  const currentSchool = useCurrentSchool()

  const [, handleAction] = useAction<UpdateMemberResponse>()

  async function handleOnValueChange(role: Role) {
    handleAction(
      () =>
        updateMemberAction({
          params: { schoolSlug: currentSchool!, memberId },
          body: {
            role,
          },
        }),
      (data) => {
        if (data.success)
          queryClient.invalidateQueries({
            queryKey: ['schools', currentSchool, 'members'],
          })
      },
    )
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
