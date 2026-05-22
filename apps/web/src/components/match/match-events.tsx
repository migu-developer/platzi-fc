import { cn } from '@/lib/utils'

type MatchEventPlayer = {
  firstName: string
  lastName: string
}

type MatchEvent = {
  minute: number
  type: string
  player?: MatchEventPlayer
  playerIn?: MatchEventPlayer
  description?: string
}

type MatchEventsProps = {
  events: MatchEvent[]
}

function formatPlayerName(player?: MatchEventPlayer): string | null {
  if (!player) return null
  return `${player.firstName} ${player.lastName}`
}

function EventIcon({ type }: { type: string }) {
  switch (type) {
    case 'goal':
      return (
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white"
          aria-label="Gol"
        >
          {'\u26BD'}
        </span>
      )
    case 'yellow_card':
      return (
        <span
          className="inline-block h-5 w-3.5 rounded-sm bg-amber-400"
          aria-label="Tarjeta amarilla"
        />
      )
    case 'red_card':
      return (
        <span className="inline-block h-5 w-3.5 rounded-sm bg-red-600" aria-label="Tarjeta roja" />
      )
    case 'substitution':
      return (
        <span
          className="inline-flex h-5 w-5 items-center justify-center text-sm"
          aria-label="Sustitucion"
        >
          {'\u21C5'}
        </span>
      )
    case 'var':
      return (
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground"
          aria-label="VAR"
        >
          {'\u{1F4FA}'}
        </span>
      )
    default:
      return (
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground"
          aria-label={type}
        >
          {'\u2022'}
        </span>
      )
  }
}

export function MatchEvents({ events }: MatchEventsProps) {
  if (!events || events.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No hay eventos registrados para este partido.
      </p>
    )
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute)

  return (
    <div className="relative space-y-0" role="list" aria-label="Eventos del partido">
      {/* Vertical timeline line */}
      <div className="absolute left-[39px] top-0 bottom-0 w-px bg-border" aria-hidden="true" />

      {sorted.map((event, index) => {
        const playerName = formatPlayerName(event.player)
        const playerInName = formatPlayerName(event.playerIn)

        return (
          <div
            key={`${event.minute}-${event.type}-${index}`}
            className="relative flex items-start gap-3 py-2.5"
            role="listitem"
          >
            {/* Minute */}
            <span className="w-8 shrink-0 text-right font-(family-name:--font-heading) text-xs font-bold text-muted-foreground">
              {event.minute}&apos;
            </span>

            {/* Icon */}
            <div className="relative z-10 shrink-0">
              <EventIcon type={event.type} />
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              {playerName && <p className="text-sm font-medium leading-tight">{playerName}</p>}
              {event.type === 'substitution' && playerInName && (
                <p className="text-xs text-emerald-600">Entra: {playerInName}</p>
              )}
              {event.description && (
                <p className="text-xs text-muted-foreground">{event.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
