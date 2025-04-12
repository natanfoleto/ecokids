import { useQuery } from '@tanstack/react-query'

import { FormSelect } from '@/components/form/form-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { usePermissions } from '@/hooks/use-permissions'
import { getInvites } from '@/http/invites/get-invites'

import { revokeInviteAction } from './actions'
import { CreateInviteForm } from './create-invite-form'
import { MemberList } from './member-list'

export function Invites() {
  const currentSchool = useCurrentSchool()

  const { permissions } = usePermissions()

  const { data } = useQuery({
    queryKey: ['schools', currentSchool, 'invites'],
    queryFn: () => getInvites({ params: { schoolSlug: currentSchool! } }),
  })

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
                {invites?.map((invite) => (
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
                            onClick={() =>
                              revokeInviteAction({
                                params: {
                                  schoolSlug: currentSchool!,
                                  inviteId: invite.id,
                                },
                              })
                            }
                          >
                            Revogar convite
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

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
