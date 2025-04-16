import type { ShutdownSchoolResponse } from '@ecokids/types'
import { useNavigate } from 'react-router-dom'

import { getCurrentSchool } from '@/auth'
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
import { useAction } from '@/hooks/use-actions'
import { queryClient } from '@/lib/react-query'

import { shutdownSchoolAction } from '../actions'

export function ShutdownSchool() {
  const navigate = useNavigate()
  const currentSchool = getCurrentSchool()

  const [, handleAction] = useAction<ShutdownSchoolResponse>()

  async function handleShutdownSchool() {
    handleAction(
      () =>
        shutdownSchoolAction({
          params: {
            schoolSlug: currentSchool!,
          },
        }),
      (data) => {
        queryClient.invalidateQueries({ queryKey: ['schools'] })
        if (data.success) navigate('/')
      },
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          Desligar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja mesmo deletar a escola?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso apagará todos os dados da escola, incluindo todos as turmas,
            alunos, prêmios e pontuações. Você não pode desfazer essa ação.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={handleShutdownSchool}
          >
            Desligar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
