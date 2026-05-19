'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

export type FilterOption = {
  label: string
  value: string
}

type FilterBarProps = {
  /** The query param name, e.g. "category" */
  paramName: string
  options: FilterOption[]
  /** Label shown as the "all" chip */
  allLabel?: string
}

export function FilterBar({ paramName, options, allLabel = 'Todos' }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get(paramName) ?? ''

  const handleClick = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(paramName, value)
      } else {
        params.delete(paramName)
      }
      params.delete('page')
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [paramName, pathname, router, searchParams],
  )

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros">
      <button
        onClick={() => handleClick('')}
        className={cn(
          'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
          !active
            ? 'border-club-primary bg-club-primary text-white'
            : 'border-border bg-background text-muted-foreground hover:border-club-primary hover:text-foreground',
        )}
      >
        {allLabel}
      </button>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            active === opt.value
              ? 'border-club-primary bg-club-primary text-white'
              : 'border-border bg-background text-muted-foreground hover:border-club-primary hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
