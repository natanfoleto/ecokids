import type { RevokeInviteResponse } from '@ecokids/types'
import { useQuery } from '@tanstack/react-query'

import { FormSelect } from '@/components/form/form-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SelectItem } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAction } from '@/hooks/use-actions'
import { usePermissions } from '@/hooks/use-permissions'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getInvites } from '@/http/invites/get-invites'
import { queryClient } from '@/lib/react-query'

import { revokeInviteAction } from './actions'
import { CreateInviteForm } from './create-invite-form'
import { MemberList } from './member-list'

export function Invites() {
  const schoolSlug = useCurrentSchoolSlug()

  const { permissions } = usePermissions()

  const { data, isLoading } = useQuery({
    queryKey: ['schools', schoolSlug, 'invites'],
    queryFn: () => getInvites({ params: { schoolSlug: schoolSlug! } }),
  })

  const [, handleAction] = useAction<RevokeInviteResponse>()

  async function handleRevokeInvite(inviteId: string) {
    handleAction(
      () =>
        revokeInviteAction({
          params: {
            schoolSlug: schoolSlug!,
            inviteId,
          },
        }),
      (data) => {
        if (data.success)
          queryClient.invalidateQueries({
            queryKey: ['schools', schoolSlug, 'invites'],
          })
      },
    )
  }

  const invites = data?.invites

  const canCreateInvite = permissions?.can('create', 'Invite')
  const canDeleteInvite = permissions?.can('delete', 'Invite')

  return (
    <div className="space-y-8">
      {canCreateInvite && (
        <Card>
          <CardContent className="w-full">
            <div className="border-muted-foreground/15 flex items-center justify-between border-b-[1px] pb-6">
              <p className="text-muted-foreground text-sm">
                Convide novos membros pelo endereço de e-mail
              </p>

              <Button variant="outline" className="cursor-pointer" disabled>
                Convite Link
              </Button>
            </div>

            <div className="pt-6">
              <CreateInviteForm />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="membros">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="membros" className="cursor-pointer">
            Membros
          </TabsTrigger>
          <TabsTrigger value="pendetes" className="cursor-pointer">
            Convites pendentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="membros" className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Filtrar..." className="flex-1" />

            <FormSelect defaultValue="MEMBER" className="w-36 cursor-pointer">
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Membro</SelectItem>
            </FormSelect>

            <FormSelect defaultValue="DATA" className="w-36 cursor-pointer">
              <SelectItem value="DATA">Data</SelectItem>
              <SelectItem value="NOME_AZ">Nome (A-Z)</SelectItem>
              <SelectItem value="NOME_ZA">Nome (Z-A)</SelectItem>
            </FormSelect>
          </div>

          <MemberList />
        </TabsContent>

        <TabsContent value="pendetes" className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Filtrar..." className="flex-1" />

            <FormSelect defaultValue="MEMBER" className="w-36 cursor-pointer">
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Membro</SelectItem>
            </FormSelect>

            <FormSelect defaultValue="DATA" className="w-36 cursor-pointer">
              <SelectItem value="DATA">Data</SelectItem>
              <SelectItem value="NOME_AZ">Nome (A-Z)</SelectItem>
              <SelectItem value="NOME_ZA">Nome (Z-A)</SelectItem>
            </FormSelect>
          </div>

          <div className="rounded border">
            <Table>
              <TableBody>
                {isLoading ? (
                  <div>
                    <InviteSkeleton />
                    <InviteSkeleton />
                  </div>
                ) : (
                  invites?.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="py-2.5">
                        <span className="text-muted-foreground">
                          {invite.email}
                        </span>
                      </TableCell>

                      <TableCell className="py-2.5 font-medium">
                        {invite.role}
                      </TableCell>

                      <TableCell className="py-2.5">
                        <div className="flex justify-end">
                          {canDeleteInvite && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="cursor-pointer"
                              onClick={() => handleRevokeInvite(invite.id)}
                            >
                              Revogar convite
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}

                {invites?.length === 0 && (
                  <TableRow>
                    <TableCell className="text-muted-foreground text-center">
                      Nenhum convite encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InviteSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Skeleton className="h-4 w-full rounded-lg" />
      <Skeleton className="h-4 w-40 rounded-lg" />
    </div>
  )
}
