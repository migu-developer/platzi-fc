'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MatchEvents } from '@/components/match/match-events'
import { MatchStats } from '@/components/match/match-stats'
import { cn } from '@/lib/utils'
import { formatMatchScore } from '@/lib/utils/format'

type MatchEvent = {
  minute: number
  type: string
  player?: { firstName: string; lastName: string }
  playerIn?: { firstName: string; lastName: string }
  description?: string
}

type StatItem = {
  label: string
  home: number
  away: number
}

type LiveMatchData = {
  _id: string
  status: string
  homeScore: number
  awayScore: number
  events: MatchEvent[]
  stats: StatItem[]
  homeTeam: { name: string }
  awayTeam: { name: string }
}

type Notification = {
  id: number
  message: string
  type: string
}

type LiveMatchTrackerProps = {
  matchId: string
  initialStatus: string
  initialHomeScore?: number
  initialAwayScore?: number
  homeTeamName: string
  awayTeamName: string
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  goal: 'GOL',
  yellow_card: 'Tarjeta Amarilla',
  red_card: 'Tarjeta Roja',
  substitution: 'Sustitucion',
  var: 'VAR',
}

function formatEventNotification(event: MatchEvent): string {
  const typeLabel = EVENT_TYPE_LABELS[event.type] ?? event.type
  const playerName = event.player ? `${event.player.firstName} ${event.player.lastName}` : ''
  return `${event.minute}' - ${typeLabel}${playerName ? ` - ${playerName}` : ''}`
}

export function LiveMatchTracker({
  matchId,
  initialStatus,
  initialHomeScore,
  initialAwayScore,
  homeTeamName,
  awayTeamName,
}: LiveMatchTrackerProps) {
  const [status, setStatus] = useState(initialStatus)
  const [homeScore, setHomeScore] = useState(initialHomeScore ?? 0)
  const [awayScore, setAwayScore] = useState(initialAwayScore ?? 0)
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [stats, setStats] = useState<StatItem[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [scoreHighlight, setScoreHighlight] = useState(false)

  const prevEventsLengthRef = useRef(0)
  const prevHomeScoreRef = useRef(initialHomeScore ?? 0)
  const prevAwayScoreRef = useRef(initialAwayScore ?? 0)
  const notificationIdRef = useRef(0)

  const fetchLiveData = useCallback(async () => {
    try {
      const res = await fetch(`/api/match-live/${matchId}`)
      if (!res.ok) return
      const data: LiveMatchData = await res.json()

      setStatus(data.status)
      setHomeScore(data.homeScore ?? 0)
      setAwayScore(data.awayScore ?? 0)
      setEvents(data.events ?? [])
      setStats(data.stats ?? [])

      // Check for score change
      if (
        data.homeScore !== prevHomeScoreRef.current ||
        data.awayScore !== prevAwayScoreRef.current
      ) {
        setScoreHighlight(true)
        setTimeout(() => setScoreHighlight(false), 1000)
        prevHomeScoreRef.current = data.homeScore ?? 0
        prevAwayScoreRef.current = data.awayScore ?? 0
      }

      // Check for new events
      const newEvents = data.events ?? []
      if (newEvents.length > prevEventsLengthRef.current) {
        const added = newEvents.slice(prevEventsLengthRef.current)
        for (const evt of added) {
          const id = ++notificationIdRef.current
          const message = formatEventNotification(evt)
          setNotifications((prev) => [...prev, { id, message, type: evt.type }])
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id))
          }, 5000)
        }
      }
      prevEventsLengthRef.current = newEvents.length
    } catch {
      // Silently ignore fetch errors for polling
    }
  }, [matchId])

  useEffect(() => {
    // Initial fetch
    fetchLiveData()

    if (status !== 'live') return

    const interval = setInterval(fetchLiveData, 15000)
    return () => clearInterval(interval)
  }, [status, fetchLiveData])

  const isLive = status === 'live'

  return (
    <Card className={cn('mt-6 transition-colors', isLive && 'border-2 border-red-500')}>
      <CardContent className="p-4 sm:p-6">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-4 space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'animate-in slide-in-from-top rounded-lg px-4 py-2 text-sm font-medium text-white',
                  n.type === 'goal' && 'bg-emerald-600',
                  n.type === 'red_card' && 'bg-red-600',
                  n.type === 'yellow_card' && 'bg-amber-500',
                  n.type === 'substitution' && 'bg-blue-600',
                  !['goal', 'red_card', 'yellow_card', 'substitution'].includes(n.type) &&
                    'bg-gray-700',
                )}
              >
                {n.message}
              </div>
            ))}
          </div>
        )}

        {/* Live indicator + Score */}
        <div className="flex flex-col items-center gap-3">
          {isLive && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
              </span>
              <Badge className="bg-red-600 text-white">EN VIVO</Badge>
            </div>
          )}

          <div className="flex items-center gap-4 sm:gap-8">
            <span className="font-(family-name:--font-heading) text-lg font-bold sm:text-xl">
              {homeTeamName}
            </span>
            <span
              className={cn(
                'font-(family-name:--font-heading) text-3xl font-bold transition-transform sm:text-4xl',
                scoreHighlight && 'scale-110',
              )}
            >
              {formatMatchScore(homeScore, awayScore)}
            </span>
            <span className="font-(family-name:--font-heading) text-lg font-bold sm:text-xl">
              {awayTeamName}
            </span>
          </div>
        </div>

        {/* Events timeline */}
        {events.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 font-(family-name:--font-heading) text-sm font-bold text-muted-foreground">
              Eventos
            </h3>
            <MatchEvents events={events} />
          </div>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <div className="mt-6">
            <MatchStats stats={stats} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
