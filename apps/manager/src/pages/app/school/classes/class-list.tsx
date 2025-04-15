import type { GetClassesResponse } from '@ecokids/types'
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
// import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getClasses } from '@/http/classes/get-classes'
import { deleteClass } from '@/http/classes/remove-class'
import { queryClient } from '@/lib/react-query'

import { UpdateClass } from './update-class'

export function ClassList() {
  const currentSchool = useCurrentSchool()

  const [updateClass, setUpdateClass] = useState<string | null>(null)

  const { data, isError } = useQuery<GetClassesResponse>({
    queryKey: ['schools', currentSchool, 'classes'],
    queryFn: async () => {
      const data = await getClasses({
        params: {
          schoolSlug: currentSchool!,
        },
      })

      return data
    },
    placeholderData: keepPreviousData,
  })

  if (isError) {
    return (
      <p className="text-red-500">
        Erro ao carregar classes. Tente novamente mais tarde.
      </p>
    )
  }

  async function removeClassAction(id: string) {
    await deleteClass({
      params: {
        schoolSlug: currentSchool!,
        classId: id,
      },
    })

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'classes'],
    })
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
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.classes.map((item) => (
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
                          <AlertDialogTrigger className="w-full">
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
                                Deseja apagar a classe {item.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá
                                permanentemente a classe.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="cursor-pointer"
                                onClick={() => removeClassAction(item.id)}
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
            ))}

            {data?.classes.length === 0 && (
              <TableRow>
                <TableCell className="text-muted-foreground text-center">
                  Nenhuma classe encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
