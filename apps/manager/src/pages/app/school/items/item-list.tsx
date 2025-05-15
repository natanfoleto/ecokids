import type { DeleteAwardResponse, GetItemsResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Camera, Ellipsis, Filter, Search } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getItems } from '@/http/items/get-items'
import { queryClient } from '@/lib/react-query'

import { UpdateItem } from '../../@dialog/items/update-item'
import { deleteItemAction } from './actions'

export function ItemList() {
  const currentSchool = useCurrentSchool()

  const [updateItem, setUpdateItem] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery<GetItemsResponse>({
    queryKey: ['schools', currentSchool, 'items'],
    queryFn: async () => {
      const data = await getItems({
        params: {
          schoolSlug: currentSchool!,
        },
      })

      return data
    },
    placeholderData: keepPreviousData,
  })

  const [, handleAction] = useAction<DeleteAwardResponse>()

  async function handleDeleteAward(itemId: string) {
    handleAction(
      () =>
        deleteItemAction({
          params: {
            schoolSlug: currentSchool!,
            itemId,
          },
        }),
      (data) => {
        if (data.success)
          queryClient.invalidateQueries({
            queryKey: ['schools', currentSchool, 'items'],
          })
      },
    )
  }

  if (isError) {
    return (
      <p className="text-red-500">
        Erro ao carregar prêmios. Tente novamente mais tarde.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <form className="flex gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2" />
          <Input className="pl-8" placeholder="Buscar itens" />
        </div>

        <Button type="submit" variant="outline">
          <Filter className="mr-2 size-3" />
          Aplicar filtros
        </Button>
      </form>

      <div className="rounded-md border-[1px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex items-center justify-center">
                <Camera className="size-4" />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <>
                <ItemSkeleton />
                <ItemSkeleton />
                <ItemSkeleton />
              </>
            ) : (
              data?.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-20">
                    <img
                      src={item.photoUrl || undefined}
                      alt="Foto do prêmio"
                      className="w-min"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="cursor-pointer"
                        >
                          <Ellipsis className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          asChild
                          onClick={() => setUpdateItem(item.id)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full cursor-pointer"
                          >
                            Editar
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <AlertDialog>
                            <AlertDialogTrigger className="w-full" asChild>
                              <Button
                                variant="ghost"
                                className="w-full cursor-pointer"
                              >
                                Remover
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Deseja apagar o prêmio {item.name}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá
                                  permanentemente o prêmio.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="cursor-pointer"
                                  onClick={() => handleDeleteAward(item.id)}
                                >
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  {updateItem === item.id && (
                    <UpdateItem
                      open={!!updateItem}
                      onClose={() => setUpdateItem(null)}
                      itemId={item.id}
                    />
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {data?.items.length === 0 && (
          <p className="text-muted-foreground p-4 text-center text-sm">
            Nenhum item encontrado.
          </p>
        )}
      </div>
    </div>
  )
}

function ItemSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-14" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-14" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-14" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-14" />
      </TableCell>
    </TableRow>
  )
}
