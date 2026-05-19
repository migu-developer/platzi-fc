import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatItem = {
  label: string
  home: number
  away: number
}

type MatchStatsProps = {
  stats: StatItem[]
  homeTeamName: string
  awayTeamName: string
}

function StatBar({ stat }: { stat: StatItem }) {
  const max = Math.max(stat.home, stat.away, 1)
  const homeWidth = (stat.home / max) * 100
  const awayWidth = (stat.away / max) * 100
  const homeIsHigher = stat.home > stat.away
  const awayIsHigher = stat.away > stat.home

  return (
    <div className="space-y-1.5">
      {/* Values and label */}
      <div className="flex items-center justify-between text-sm">
        <span
          className={cn(
            'w-10 text-left tabular-nums',
            homeIsHigher && 'font-bold text-club-primary',
          )}
        >
          {stat.home}
        </span>
        <span className="flex-1 text-center text-xs text-muted-foreground">
          {stat.label}
        </span>
        <span
          className={cn(
            'w-10 text-right tabular-nums',
            awayIsHigher && 'font-bold',
          )}
        >
          {stat.away}
        </span>
      </div>

      {/* Bars */}
      <div className="flex items-center gap-1">
        {/* Home bar — grows from right to left */}
        <div className="flex h-2 flex-1 justify-end rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-club-primary transition-all"
            style={{ width: `${homeWidth}%` }}
          />
        </div>

        {/* Away bar — grows from left to right */}
        <div className="flex h-2 flex-1 justify-start rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-muted-foreground/30 transition-all"
            style={{ width: `${awayWidth}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function MatchStats({ stats, homeTeamName, awayTeamName }: MatchStatsProps) {
  if (!stats || stats.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No hay estadisticas disponibles para este partido.
      </p>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="font-(family-name:--font-heading) text-sm font-bold text-club-primary">
            {homeTeamName}
          </span>
          <span className="text-xs text-muted-foreground">Estadisticas</span>
          <span className="font-(family-name:--font-heading) text-sm font-bold">
            {awayTeamName}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <StatBar key={stat.label} stat={stat} />
        ))}
      </CardContent>
    </Card>
  )
}
