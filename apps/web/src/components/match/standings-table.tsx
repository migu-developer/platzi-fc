import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StandingsTeam = {
  name: string
  badge?: { asset?: { url: string } }
  slug?: { current: string }
}

type StandingsRow = {
  team: StandingsTeam
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form?: string[]
}

type StandingsTableProps = {
  rows: StandingsRow[]
  highlightTeam?: string
}

const FORM_COLORS: Record<string, string> = {
  W: 'bg-emerald-500',
  D: 'bg-amber-400',
  L: 'bg-red-500',
}

const FORM_LABELS: Record<string, string> = {
  W: 'Victoria',
  D: 'Empate',
  L: 'Derrota',
}

export function StandingsTable({ rows, highlightTeam }: StandingsTableProps) {
  if (!rows || rows.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-sm text-muted-foreground">
            No hay datos de clasificacion disponibles.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-(family-name:--font-heading)">
          Clasificacion
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b bg-muted/50 text-xs font-medium text-muted-foreground">
              <th scope="col" className="px-3 py-2 text-center">#</th>
              <th scope="col" className="px-3 py-2 text-left">Equipo</th>
              <th scope="col" className="px-3 py-2 text-center">PJ</th>
              <th scope="col" className="px-3 py-2 text-center">PG</th>
              <th scope="col" className="px-3 py-2 text-center">PE</th>
              <th scope="col" className="px-3 py-2 text-center">PP</th>
              <th scope="col" className="px-3 py-2 text-center">GF</th>
              <th scope="col" className="px-3 py-2 text-center">GC</th>
              <th scope="col" className="px-3 py-2 text-center">DG</th>
              <th scope="col" className="px-3 py-2 text-center font-bold">Pts</th>
              <th scope="col" className="px-3 py-2 text-center">Forma</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isHighlighted =
                highlightTeam != null && row.team.name === highlightTeam
              const position = index + 1

              return (
                <tr
                  key={row.team.slug?.current ?? row.team.name}
                  className={cn(
                    'border-b transition-colors last:border-b-0 hover:bg-muted/30',
                    isHighlighted && 'bg-club-light font-semibold'
                  )}
                >
                  <td className="px-3 py-2.5 text-center text-xs text-muted-foreground">
                    {position}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {row.team.badge?.asset?.url ? (
                        <Image
                          src={row.team.badge.asset.url}
                          alt={`Escudo de ${row.team.name}`}
                          width={20}
                          height={20}
                          className="shrink-0 object-contain"
                        />
                      ) : (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                          {row.team.name.charAt(0)}
                        </span>
                      )}
                      <span
                        className={cn(
                          'truncate',
                          isHighlighted && 'text-club-primary'
                        )}
                      >
                        {row.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center">{row.played}</td>
                  <td className="px-3 py-2.5 text-center">{row.won}</td>
                  <td className="px-3 py-2.5 text-center">{row.drawn}</td>
                  <td className="px-3 py-2.5 text-center">{row.lost}</td>
                  <td className="px-3 py-2.5 text-center">{row.goalsFor}</td>
                  <td className="px-3 py-2.5 text-center">{row.goalsAgainst}</td>
                  <td className="px-3 py-2.5 text-center">
                    {row.goalDifference > 0
                      ? `+${row.goalDifference}`
                      : row.goalDifference}
                  </td>
                  <td className="px-3 py-2.5 text-center font-(family-name:--font-heading) font-bold">
                    {row.points}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      {(row.form ?? []).slice(-5).map((result, i) => (
                        <span
                          key={i}
                          className={cn(
                            'inline-block h-2 w-2 rounded-full',
                            FORM_COLORS[result] ?? 'bg-muted'
                          )}
                          title={FORM_LABELS[result] ?? result}
                          aria-label={FORM_LABELS[result] ?? result}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
