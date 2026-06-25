import { toast } from '@ecokids/ui'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Search, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStepper } from '@/contexts/stepper'
import { useCurrentSchoolSlug } from '@/hooks/use-current-school'
import { useMetadata } from '@/hooks/use-metadata'
import { getStudentByCode } from '@/http/students/get-student-by-code'

import { StudentSearchModal } from './student-search-modal'

export function CodeEntry() {
  useMetadata('Pontuador - Código do aluno')

  const currentSchool = useCurrentSchoolSlug()

  const { nextStep, setStudent } = useStepper()

  const [code, setCode] = useState('')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const { mutate: getStudentByCodeAction, isPending } = useMutation({
    mutationFn: async (studentCode: string) => {
      const { student } = await getStudentByCode({
        params: {
          schoolSlug: currentSchool!,
          code: studentCode,
        },
      })

      return student
    },
    onSuccess: (student) => {
      setStudent(student)
      nextStep()
    },
    onError: () => {
      toast.error('Aluno não encontrado!', {
        description:
          'Verifique se o código do aluno está correto e tente novamente.',
      })
    },
  })

  function handleSearch() {
    getStudentByCodeAction(code)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && code && !isPending) {
      handleSearch()
    }
  }

  function handleSelectStudent(studentCode: number) {
    const codeStr = String(studentCode)
    setCode(codeStr)
    getStudentByCodeAction(codeStr)
  }

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-4">
        {/* Icon + Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
            <UserRound className="size-12 text-white" />
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Identificar aluno
            </h2>
            <p className="text-base text-gray-500">
              Digite o código do aluno para começar a pontuar
            </p>
          </div>
        </div>

        {/* Input + Buttons */}
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <Input
            ref={inputRef}
            type="number"
            placeholder="000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-24 w-full rounded-2xl border-2 border-emerald-200 bg-white text-center text-4xl font-bold tracking-widest shadow-sm transition-all focus:border-emerald-500 focus:shadow-md focus:shadow-emerald-100"
          />

          <Button
            onClick={handleSearch}
            disabled={!code || isPending}
            className="h-16 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xl font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-300 active:scale-95 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <>
                <Search className="size-5" />
                Buscar aluno
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Search className="size-4" />
            Buscar por nome
          </button>

          <p className="text-sm text-gray-400">
            Pressione{' '}
            <kbd className="rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs font-semibold">
              Enter
            </kbd>{' '}
            ou toque em Buscar para continuar
          </p>
        </div>
      </div>

      <StudentSearchModal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectStudent={handleSelectStudent}
      />
    </>
  )
}
