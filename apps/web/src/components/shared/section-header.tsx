import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

type SectionHeaderProps = {
  title: string
  description?: string
  viewAllHref?: string
  viewAllLabel?: string
  className?: string
}

export function SectionHeader({
  title,
  description,
  viewAllHref,
  viewAllLabel = 'Ver todo',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div>
        <h2 className="font-(family-name:--font-heading) text-2xl font-bold tracking-tight">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-club-primary hover:underline"
        >
          {viewAllLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
