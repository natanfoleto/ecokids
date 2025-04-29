import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStepper } from '@/contexts/stepper'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getStudentByCode } from '@/http/students/get-student-by-code'

export function CaptureCode() {
  const currentSchool = useCurrentSchool()

  const { nextStep, setStudent } = useStepper()

  const [code, setCode] = useState('')

  const { mutate: getStudentByCodeAction, isPending } = useMutation({
    mutationFn: async () => {
      const { student } = await getStudentByCode({
        params: {
          schoolSlug: currentSchool!,
          code,
        },
      })

      return student
    },
    onSuccess: (student) => {
      setStudent(student)
      nextStep()
    },
    onError: (error) => {
      toast.error('Houve um erro ao buscar o aluno!', {
        description:
          'Verifique se o código do aluno existe, caso o erro persista entre em contato com o suporte.',
      })

      console.log(error)
    },
  })

  function handleSearch() {
    getStudentByCodeAction()
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Input
        type="number"
        placeholder="Código do aluno"
        onChange={(e) => setCode(e.target.value)}
        className="h-20 w-1/2 text-center !text-2xl"
      />

      <Button
        onClick={handleSearch}
        disabled={!code || isPending}
        className="h-16 w-1/2 cursor-pointer bg-emerald-500 py-5 text-xl hover:bg-emerald-600"
      >
        {isPending ? <Loader2 className="size-4" /> : 'Buscar'}
      </Button>
    </div>
  )
}
