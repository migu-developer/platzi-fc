import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime, formatMatchScore } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

type MatchCardTeam = {
  name: string
  badge?: { url: string; alt: string }
}

type MatchCardProps = {
  slug: string
  datetime: string
  status: 'scheduled' | 'live' | 'finished' | 'suspended'
  homeTeam: MatchCardTeam
  awayTeam: MatchCardTeam
  homeScore?: number
  awayScore?: number
  competition?: string
  matchday?: number
  /** Current minute for live matches */
  liveMinute?: number
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Programado',
  live: 'En Vivo',
  finished: 'Finalizado',
  suspended: 'Suspendido',
}

export function MatchCard({
  slug,
  datetime,
  status,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  competition,
  matchday,
  liveMinute,
}: MatchCardProps) {
  const isLive = status === 'live'
  const isFinished = status === 'finished'

  return (
    <Link href={`/partidos/${slug}`}>
      <Card
        className={cn(
          'transition-shadow hover:shadow-md',
          isLive && 'border-red-500/50 shadow-red-500/10 shadow-md',
        )}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {competition}
              {matchday != null && ` — J${matchday}`}
            </span>
            <div className="flex items-center gap-1.5">
              {isLive && liveMinute != null && (
                <span className="text-xs font-bold text-red-600">{liveMinute}&apos;</span>
              )}
              <Badge
                variant={isLive ? 'default' : 'secondary'}
                className={cn(
                  isLive && 'animate-pulse bg-red-600 text-white',
                  isFinished && 'bg-muted text-muted-foreground',
                )}
              >
                {isLive && (
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                )}
                {STATUS_LABELS[status]}
              </Badge>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* Home */}
            <div className="text-right">
              <p className={cn(
                'text-sm font-semibold',
                isFinished && homeScore != null && awayScore != null && homeScore > awayScore && 'text-club-primary',
              )}>
                {homeTeam.name}
              </p>
            </div>

            {/* Score */}
            <div
              className={cn(
                'flex items-center justify-center rounded-md px-3 py-1.5',
                isLive ? 'bg-red-600 text-white' : 'bg-muted',
              )}
            >
              <span className="font-(family-name:--font-heading) text-lg font-bold">
                {formatMatchScore(homeScore, awayScore)}
              </span>
            </div>

            {/* Away */}
            <div className="text-left">
              <p className={cn(
                'text-sm font-semibold',
                isFinished && homeScore != null && awayScore != null && awayScore > homeScore && 'text-club-primary',
              )}>
                {awayTeam.name}
              </p>
            </div>
          </div>

          {/* Date */}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {formatDateTime(datetime)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
