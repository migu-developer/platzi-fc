'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type LineupPlayer = {
  player?: {
    firstName: string
    lastName: string
  }
  position?: string
  number?: number
  starter: boolean
}

type LineupDisplayProps = {
  homeLineup: LineupPlayer[]
  awayLineup: LineupPlayer[]
  homeTeamName: string
  awayTeamName: string
}

const POSITION_ORDER: Record<string, number> = {
  GK: 0,
  DEF: 1,
  MID: 2,
  FWD: 3,
}

const POSITION_LABELS: Record<string, string> = {
  GK: 'Portero',
  DEF: 'Defensa',
  MID: 'Centrocampista',
  FWD: 'Delantero',
}

const POSITION_COLORS: Record<string, string> = {
  GK: 'bg-amber-100 text-amber-800',
  DEF: 'bg-blue-100 text-blue-800',
  MID: 'bg-emerald-100 text-emerald-800',
  FWD: 'bg-red-100 text-red-800',
}

function sortByPosition(players: LineupPlayer[]): LineupPlayer[] {
  return [...players].sort((a, b) => {
    const orderA = POSITION_ORDER[a.position ?? ''] ?? 99
    const orderB = POSITION_ORDER[b.position ?? ''] ?? 99
    if (orderA !== orderB) return orderA - orderB
    return (a.number ?? 99) - (b.number ?? 99)
  })
}

function PlayerRow({ player }: { player: LineupPlayer }) {
  const name = player.player
    ? `${player.player.firstName} ${player.player.lastName}`
    : 'Desconocido'

  return (
    <div className="flex items-center gap-2 py-1.5">
      {player.number != null && (
        <span className="w-6 shrink-0 text-center font-(family-name:--font-heading) text-xs font-bold text-muted-foreground">
          {player.number}
        </span>
      )}
      <span className="flex-1 truncate text-sm">{name}</span>
      {player.position && (
        <Badge variant="secondary" className={cn('text-[10px]', POSITION_COLORS[player.position])}>
          {POSITION_LABELS[player.position] ?? player.position}
        </Badge>
      )}
    </div>
  )
}

function LineupSection({ lineup }: { lineup: LineupPlayer[] }) {
  if (!lineup || lineup.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">Alineacion no disponible.</p>
    )
  }

  const starters = sortByPosition(lineup.filter((p) => p.starter))
  const substitutes = sortByPosition(lineup.filter((p) => !p.starter))

  return (
    <div className="space-y-4">
      {/* Starters */}
      <div>
        <h4 className="mb-2 font-(family-name:--font-heading) text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Titulares
        </h4>
        <div className="divide-y">
          {starters.length > 0 ? (
            starters.map((p, i) => <PlayerRow key={`starter-${p.number ?? i}`} player={p} />)
          ) : (
            <p className="py-2 text-sm text-muted-foreground">Sin titulares registrados.</p>
          )}
        </div>
      </div>

      {/* Substitutes */}
      {substitutes.length > 0 && (
        <div>
          <h4 className="mb-2 font-(family-name:--font-heading) text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Suplentes
          </h4>
          <div className="divide-y">
            {substitutes.map((p, i) => (
              <PlayerRow key={`sub-${p.number ?? i}`} player={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function LineupDisplay({
  homeLineup,
  awayLineup,
  homeTeamName,
  awayTeamName,
}: LineupDisplayProps) {
  const hasHome = homeLineup && homeLineup.length > 0
  const hasAway = awayLineup && awayLineup.length > 0

  if (!hasHome && !hasAway) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">Alineaciones no disponibles.</p>
    )
  }

  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">
          Local
          {homeTeamName && (
            <span className="ml-1 hidden text-muted-foreground sm:inline">({homeTeamName})</span>
          )}
        </TabsTrigger>
        <TabsTrigger value="away">
          Visitante
          {awayTeamName && (
            <span className="ml-1 hidden text-muted-foreground sm:inline">({awayTeamName})</span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="home">
        <LineupSection lineup={homeLineup} />
      </TabsContent>

      <TabsContent value="away">
        <LineupSection lineup={awayLineup} />
      </TabsContent>
    </Tabs>
  )
}
