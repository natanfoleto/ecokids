import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  limit: number
  totalCount: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  limit,
  totalCount,
  pageCount,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="text-muted-foreground text-sm font-light">
        Exibindo {Math.min(limit * page, totalCount)} de {totalCount} registros
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="mx-2 flex select-none items-center justify-center text-sm font-medium">
          Página {page} de {pageCount || 1}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 cursor-pointer p-0"
          onClick={() => onPageChange(pageCount)}
          disabled={page >= pageCount}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
