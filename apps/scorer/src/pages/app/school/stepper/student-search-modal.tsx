import { useQuery } from '@tanstack/react-query'
import { Search, UserRound, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentSchoolSlug } from '@/hooks/use-current-school'
import { getStudents } from '@/http/students/get-students'

interface StudentSearchModalProps {
  open: boolean
  onClose: () => void
  onSelectStudent: (code: number) => void
}

export function StudentSearchModal({
  open,
  onClose,
  onSelectStudent,
}: StudentSearchModalProps) {
  const currentSchool = useCurrentSchoolSlug()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setSearch('')
      setDebouncedSearch('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const { data, isLoading } = useQuery({
    queryKey: ['schools', currentSchool, 'students', 'search', debouncedSearch],
    queryFn: () =>
      getStudents({
        params: { schoolSlug: currentSchool! },
        query: { search: debouncedSearch, limit: 20 },
      }),
    enabled: open && debouncedSearch.length >= 2,
  })

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar aluno por nome"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 flex w-full max-w-md flex-col gap-4 rounded-3xl border border-white/20 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100">
              <Search className="size-4 text-emerald-600" />
            </div>
            <h2 className="text-base font-bold text-gray-800">
              Buscar aluno por nome
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Search input */}
        <Input
          ref={inputRef}
          id="student-search-input"
          type="text"
          placeholder="Digite o nome do aluno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 rounded-2xl border-2 border-emerald-100 px-4 font-semibold text-gray-800 transition-all placeholder:text-gray-300 focus-visible:border-emerald-300 focus-visible:ring-emerald-100/50"
        />

        {/* Results area */}
        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
          {/* Hint before typing */}
          {debouncedSearch.length < 2 && (
            <p className="py-6 text-center text-sm text-gray-400">
              Digite pelo menos 2 caracteres para buscar
            </p>
          )}

          {/* Loading state */}
          {isLoading && debouncedSearch.length >= 2 && (
            <>
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </>
          )}

          {/* Empty state */}
          {!isLoading &&
            debouncedSearch.length >= 2 &&
            data?.students.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-6">
                <UserRound className="size-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-400">
                  Nenhum aluno encontrado
                </p>
                <p className="text-xs text-gray-300">
                  Tente buscar por outro nome
                </p>
              </div>
            )}

          {/* Results list */}
          {!isLoading &&
            data?.students.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() => {
                  onSelectStudent(student.code)
                  onClose()
                }}
                className="flex w-full items-center gap-3 rounded-2xl border-2 border-transparent bg-gray-50 px-4 py-3 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50 active:scale-95"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                  <UserRound className="size-5 text-emerald-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-800">
                    #{student.code} — {student.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {student.class.name} · {student.class.year}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
