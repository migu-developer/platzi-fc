import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type PlayerCardProps = {
  slug: string
  firstName: string
  lastName: string
  number?: number
  position: string
  nationality?: string
  photo?: { url: string; alt: string }
}

const POSITION_LABELS: Record<string, string> = {
  goalkeeper: 'Portero',
  defender: 'Defensa',
  midfielder: 'Centrocampista',
  forward: 'Delantero',
}

const POSITION_COLORS: Record<string, string> = {
  goalkeeper: 'bg-amber-100 text-amber-800',
  defender: 'bg-blue-100 text-blue-800',
  midfielder: 'bg-emerald-100 text-emerald-800',
  forward: 'bg-red-100 text-red-800',
}

export function PlayerCard({
  slug,
  firstName,
  lastName,
  number,
  position,
  nationality,
  photo,
}: PlayerCardProps) {
  return (
    <Link href={`/equipo/${slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        {/* Photo */}
        <div className="relative aspect-[3/4] bg-muted">
          {photo ? (
            <Image
              src={photo.url}
              alt={photo.alt || `${firstName} ${lastName}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-(family-name:--font-heading) text-4xl font-bold text-muted-foreground/30">
                {number ?? '?'}
              </span>
            </div>
          )}
          {number != null && (
            <span className="absolute right-2 top-2 font-(family-name:--font-heading) text-3xl font-bold text-white/80 drop-shadow-md">
              {number}
            </span>
          )}
        </div>

        <CardContent className="p-3">
          <p className="font-(family-name:--font-heading) text-sm font-bold leading-tight">
            {firstName} {lastName}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Badge variant="secondary" className={POSITION_COLORS[position]}>
              {POSITION_LABELS[position] || position}
            </Badge>
            {nationality && <span className="text-xs text-muted-foreground">{nationality}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
