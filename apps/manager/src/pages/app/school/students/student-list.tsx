import type { DeleteStudentResponse, GetStudentsResponse } from '@ecokids/types'
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
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getStudents } from '@/http/students/get-students'
import { queryClient } from '@/lib/react-query'
import { UpdateStudent } from '@/pages/app/@dialog/students/update-student'

import { deleteStudentAction } from './actions'

export function StudentList() {
  const currentSchool = useCurrentSchool()

  const [updateStudent, setUpdateStudent] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery<GetStudentsResponse>({
    queryKey: ['schools', currentSchool, 'students'],
    queryFn: async () => {
      const data = await getStudents({
        params: {
          schoolSlug: currentSchool!,
        },
      })

      return data
    },
    placeholderData: keepPreviousData,
  })

  const [, handleAction] = useAction<DeleteStudentResponse>()

  async function handleDeleteStudent(studentId: string) {
    handleAction(
      () =>
        deleteStudentAction({
          params: {
            schoolSlug: currentSchool!,
            studentId,
          },
        }),
      (data) => {
        if (data.success)
          queryClient.invalidateQueries({
            queryKey: ['schools', currentSchool, 'students'],
          })
      },
    )
  }

  if (isError) {
    return (
      <p className="text-red-500">
        Erro ao carregar alunos. Tente novamente mais tarde.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <form className="flex gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2" />
          <Input className="pl-8" placeholder="Buscar alunos" />
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
              <TableHead className="w-16 text-center">Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Pontuação</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <>
                <StudentSkeleton />
                <StudentSkeleton />
                <StudentSkeleton />
              </>
            ) : (
              data?.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="text-center">{student.code}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student._count.points}</TableCell>
                  <TableCell>
                    {student.class.name} - {student.class.year}
                  </TableCell>

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
                          onClick={() => setUpdateStudent(student.id)}
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
                                  Deseja apagar o aluno {student.name}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Isso excluirá
                                  permanentemente o aluno.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleDeleteStudent(student.id)
                                  }
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

                  {updateStudent === student.id && (
                    <UpdateStudent
                      open={!!updateStudent}
                      onClose={() => setUpdateStudent(null)}
                      studentId={student.id}
                    />
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {data?.students.length === 0 && (
          <p className="text-muted-foreground p-4 text-center text-sm">
            Nenhum aluno encontrado.
          </p>
        )}
      </div>
    </div>
  )
}

function StudentSkeleton() {
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
