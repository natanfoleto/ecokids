import type { RemoveMemberResponse } from '@ecokids/types'
import { useQueries } from '@tanstack/react-query'
import { Crown } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { usePermissions } from '@/hooks/use-permissions'
import { getMembers } from '@/http/members/get-members'
import { getSchool } from '@/http/schools/get-school'
import { queryClient } from '@/lib/react-query'
import { getInitialsName } from '@/utils/get-initials-name'

import { removeMemberAction } from './actions'
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

  const [
    { data: dataMembers, isLoading: isLoadingMembers },
    { data: dataSchool, isLoading: isLoadingSchool },
  ] = results

  const [, handleAction] = useAction<RemoveMemberResponse>()

  async function handleRemoveMember(memberId: string) {
    handleAction(
      () =>
        removeMemberAction({
          params: { schoolSlug: currentSchool!, memberId },
        }),
      (data) => {
        if (data.success)
          queryClient.invalidateQueries({
            queryKey: ['schools', currentSchool, 'members'],
          })
      },
    )
  }

  const isLoading = isLoadingMembers || isLoadingSchool

  const members = dataMembers?.members
  const school = dataSchool?.school

  const canUpdateMember = permissions?.can('update', 'Member')
  const canDeleteMember = permissions?.can('delete', 'Member')

  return (
    <div className="rounded border">
      <Table>
        <TableBody>
          {isLoading ? (
            <>
              <MemberSkeleton />
              <MemberSkeleton />
              <MemberSkeleton />
            </>
          ) : (
            members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="py-2.5" style={{ width: 48 }}>
                  <Avatar>
                    {member.avatarUrl && <AvatarImage src={member.avatarUrl} />}
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
                      <Button
                        disabled={
                          member.id === membership?.userId ||
                          member.userId === school?.ownerId
                        }
                        type="submit"
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function MemberSkeleton() {
  return (
    <TableRow>
      <TableCell className="flex items-center justify-between p-2">
        <div className="flex w-full items-center gap-2">
          <Skeleton className="size-10 rounded-full" />

          <div className="w-full space-y-1">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-80" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </TableCell>
    </TableRow>
  )
}
