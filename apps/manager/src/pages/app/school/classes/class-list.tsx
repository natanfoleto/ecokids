import type { DeleteClassResponse, GetClassesResponse } from '@ecokids/types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Ellipsis, Filter, Search } from 'lucide-react'
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
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getClasses } from '@/http/classes/get-classes'
import { queryClient } from '@/lib/react-query'
import { UpdateClass } from '@/pages/app/@sheet/classes/update-class'

import { deleteClassAction } from './actions'

export function ClassList() {
  const schoolSlug = useCurrentSchoolSlug()

  const [updateClass, setUpdateClass] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery<GetClassesResponse>({
    queryKey: ['schools', schoolSlug, 'classes'],
    queryFn: async () => {
      const data = await getClasses({
        params: {
          schoolSlug: schoolSlug!,
        },
      })

      return data
    },
    placeholderData: keepPreviousData,
  })

  const [, handleAction] = useAction<DeleteClassResponse>()

  async function handleDeleteClass(classId: string) {
    handleAction(
      () =>
        deleteClassAction({
          params: {
            schoolSlug: schoolSlug!,
            classId,
          },
        }),
      (data) => {
        if (data.success)
          queryClient.invalidateQueries({
            queryKey: ['schools', schoolSlug, 'classes'],
          })
      },
    )
  }

  if (isError) {
    return (
      <p className="text-red-500">
        Erro ao carregar turmas. Tente novamente mais tarde.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <form className="flex gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2" />
          <Input className="pl-8" placeholder="Buscar classes" />
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
              <TableHead>Nome</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <>
                <ClassSkeleton />
                <ClassSkeleton />
                <ClassSkeleton />
              </>
            ) : (
              data?.classes.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell className="flex justify-end">
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
                          onClick={() => setUpdateClass(item.id)}
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
                                  Deseja apagar a turma {item.name}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá
                                  permanentemente a turma.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="cursor-pointer"
                                  onClick={() => handleDeleteClass(item.id)}
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

                  {updateClass === item.id && (
                    <UpdateClass
                      open={!!updateClass}
                      onClose={() => setUpdateClass(null)}
                      classId={item.id}
                    />
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {data?.classes.length === 0 && (
          <p className="text-muted-foreground p-4 text-center text-sm">
            Nenhuma turma encontrada.
          </p>
        )}
      </div>
    </div>
  )
}

function ClassSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
    </TableRow>
  )
}
