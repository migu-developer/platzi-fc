import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type PaginationProps = {
  currentPage: number
  totalPages: number
  baseHref: string
  /** Additional query params to preserve, e.g. { category: 'club' } */
  queryParams?: Record<string, string>
}

function buildHref(
  baseHref: string,
  page: number,
  queryParams?: Record<string, string>,
): string {
  const params = new URLSearchParams(queryParams)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `${baseHref}?${qs}` : baseHref
}

export function Pagination({ currentPage, totalPages, baseHref, queryParams }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | 'ellipsis')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis')
    }
  }

  return (
    <nav aria-label="Paginacion" className="mt-8 flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Button variant="ghost" size="icon" render={<Link href={buildHref(baseHref, currentPage - 1, queryParams)} aria-label="Anterior" />}>
            <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          p === currentPage ? (
            <Button
              key={p}
              variant="default"
              size="icon"
              className={cn(
                'h-9 w-9',
                'bg-club-primary text-white hover:bg-club-primary-light',
              )}
            >
              <span aria-current="page">{p}</span>
            </Button>
          ) : (
            <Button
              key={p}
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              render={<Link href={buildHref(baseHref, p, queryParams)} />}
            >
              {p}
            </Button>
          )
        ),
      )}

      {currentPage < totalPages && (
        <Button variant="ghost" size="icon" render={<Link href={buildHref(baseHref, currentPage + 1, queryParams)} aria-label="Siguiente" />}>
            <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}
