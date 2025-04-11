import { useQueries } from '@tanstack/react-query'
import { Crown } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { usePermissions } from '@/hooks/use-permissions'
import { getMembers } from '@/http/members/get-members'
import { getSchool } from '@/http/schools/get-school'
import { getInitialsName } from '@/utils/get-initials-name'

import { UpdateRoleMember } from './update-role-select'

export function MemberList() {
  const currentSchool = useCurrentSchool()

  const { permissions, membership } = usePermissions()

  const results = useQueries({
    queries: [
      {
        queryKey: ['schools', currentSchool, 'members'],
        queryFn: () =>
          getMembers({
            params: {
              schoolSlug: currentSchool!,
            },
          }),
      },
      {
        queryKey: ['schools', currentSchool],
        queryFn: () =>
          getSchool({
            params: {
              schoolSlug: currentSchool!,
            },
          }),
      },
    ],
  })

  const [{ data: dataMembers }, { data: dataSchool }] = results

  const members = dataMembers?.members
  const school = dataSchool?.school

  const canUpdateMember = permissions?.can('update', 'Member')
  const canDeleteMember = permissions?.can('delete', 'Member')

  return (
    <div className="rounded border">
      <Table>
        <TableBody>
          {members?.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="py-2.5" style={{ width: 48 }}>
                <Avatar>
                  <AvatarFallback>
                    {member.name && getInitialsName(member.name)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>

              <TableCell className="py-2.5">
                <div className="flex flex-col">
                  <span className="inline-flex items-center gap-2 font-medium">
                    {member.name}
                    {member.userId === membership?.userId && ' (me)'}
                    {member.userId === school?.ownerId && (
                      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                        <Crown className="size-3" /> Dono
                      </span>
                    )}
                  </span>
                  <span className="text-sx text-muted-foreground">
                    {member.email}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-2.5">
                <div className="flex items-center justify-end gap-2">
                  <UpdateRoleMember
                    memberId={member.id}
                    value={member.role}
                    disabled={
                      !canUpdateMember ||
                      member.id === membership?.userId ||
                      member.userId === school?.ownerId
                    }
                  />

                  {canDeleteMember && (
                    <form>
                      <Button
                        disabled={
                          member.id === membership?.userId ||
                          member.userId === school?.ownerId
                        }
                        type="submit"
                        size="sm"
                        variant="destructive"
                      >
                        Remover
                      </Button>
                    </form>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
