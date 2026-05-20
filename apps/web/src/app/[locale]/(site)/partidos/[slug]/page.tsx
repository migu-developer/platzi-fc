import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { MATCH_BY_SLUG_QUERY } from '@/lib/sanity/queries'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { JsonLd, sportsEventJsonLd } from '@/components/shared/json-ld'
import { MatchEvents } from '@/components/match/match-events'
import { MatchStats } from '@/components/match/match-stats'
import { MatchMedia } from '@/components/match/match-media'
import { LineupDisplay } from '@/components/match/lineup-display'
import { LiveMatchTracker } from '@/components/match/live-match-tracker'
import { formatDateTime, formatMatchScore } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

type MatchData = {
  _id: string
  datetime: string
  status: 'scheduled' | 'live' | 'finished' | 'suspended'
  homeScore?: number
  awayScore?: number
  matchday?: number
  attendance?: number
  referee?: string
  slug: { current: string }
  homeTeam: { _id: string; name: string; badge?: { asset?: { url: string } } }
  awayTeam: { _id: string; name: string; badge?: { asset?: { url: string } } }
  competition?: { _id: string; name: string; slug?: { current: string } }
  season?: { _id: string; name: string }
  venue?: { _id: string; name: string; city?: string }
  homeLineup?: Array<{
    player?: { firstName: string; lastName: string }
    position?: string
    number?: number
    starter: boolean
  }>
  awayLineup?: Array<{
    player?: { firstName: string; lastName: string }
    position?: string
    number?: number
    starter: boolean
  }>
  events?: Array<{
    minute: number
    type: string
    player?: { firstName: string; lastName: string }
    playerIn?: { firstName: string; lastName: string }
    description?: string
  }>
  stats?: Array<{ label: string; home: number; away: number }>
}

async function getMatch(slug: string) {
  return client
    .fetch<MatchData | null>(MATCH_BY_SLUG_QUERY, { slug }, { next: { tags: ['match'] } })
    .catch(() => null)
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Programado',
  live: 'En Vivo',
  finished: 'Finalizado',
  suspended: 'Suspendido',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const match = await getMatch(slug)
  if (!match) return { title: 'Partido no encontrado' }
  const title = `${match.homeTeam.name} vs ${match.awayTeam.name}`
  return {
    title,
    description: `${title} — ${match.competition?.name || 'Partido'} de Platzi FC.`,
  }
}

export default async function PartidoDetailPage({ params }: Props) {
  const { slug } = await params
  const match = await getMatch(slug)
  if (!match) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com'
  const hasLineups =
    (match.homeLineup && match.homeLineup.length > 0) ||
    (match.awayLineup && match.awayLineup.length > 0)
  const hasEvents = match.events && match.events.length > 0
  const hasStats = match.stats && match.stats.length > 0

  return (
    <>
      <JsonLd
        data={sportsEventJsonLd({
          name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          startDate: match.datetime,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          location: match.venue ? { name: match.venue.name, address: match.venue.city } : undefined,
          url: `${siteUrl}/partidos/${match.slug.current}`,
        })}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Partidos', href: '/partidos' },
            { label: `${match.homeTeam.name} vs ${match.awayTeam.name}` },
          ]}
        />

        {/* Scoreboard */}
        <Card className="overflow-hidden bg-club-primary text-white">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm text-club-accent">
              {match.competition && <span>{match.competition.name}</span>}
              {match.matchday != null && <span>Jornada {match.matchday}</span>}
              {match.season && <span>{match.season.name}</span>}
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
              <div className="text-right">
                <p className="font-(family-name:--font-heading) text-xl font-bold sm:text-2xl">
                  {match.homeTeam.name}
                </p>
              </div>
              <div className="text-center">
                <p className="font-(family-name:--font-heading) text-4xl font-bold sm:text-5xl">
                  {formatMatchScore(match.homeScore, match.awayScore)}
                </p>
                <Badge
                  className={cn(
                    'mt-2',
                    match.status === 'live' && 'animate-pulse bg-red-600 text-white',
                    match.status === 'finished' && 'bg-club-accent text-club-dark',
                    match.status === 'scheduled' && 'bg-white/20 text-white',
                  )}
                >
                  {STATUS_LABELS[match.status]}
                </Badge>
              </div>
              <div className="text-left">
                <p className="font-(family-name:--font-heading) text-xl font-bold sm:text-2xl">
                  {match.awayTeam.name}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-club-accent/80">
              <span>{formatDateTime(match.datetime)}</span>
              {match.venue && <span>{match.venue.name}</span>}
              {match.attendance != null && (
                <span>{match.attendance.toLocaleString('es')} espectadores</span>
              )}
              {match.referee && <span>Arbitro: {match.referee}</span>}
            </div>
          </CardContent>
        </Card>

        {/* Live Match Tracker */}
        {match.status === 'live' && (
          <LiveMatchTracker
            matchId={match._id}
            initialStatus={match.status}
            initialHomeScore={match.homeScore}
            initialAwayScore={match.awayScore}
            homeTeamName={match.homeTeam.name}
            awayTeamName={match.awayTeam.name}
          />
        )}

        {/* Tabs */}
        <Tabs defaultValue="summary" className="mt-8">
          <TabsList className="flex-wrap">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            {hasStats && <TabsTrigger value="stats">Estadisticas</TabsTrigger>}
            {hasLineups && <TabsTrigger value="lineups">Alineaciones</TabsTrigger>}
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* Summary — events timeline */}
          <TabsContent value="summary" className="mt-4">
            {hasEvents ? (
              <MatchEvents events={match.events!} />
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  {match.status === 'scheduled'
                    ? 'El resumen estara disponible una vez finalice el partido.'
                    : 'No hay eventos registrados para este partido.'}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Stats comparison */}
          {hasStats && (
            <TabsContent value="stats" className="mt-4">
              <MatchStats
                stats={match.stats!}
                homeTeamName={match.homeTeam.name}
                awayTeamName={match.awayTeam.name}
              />
            </TabsContent>
          )}

          {/* Lineups */}
          {hasLineups && (
            <TabsContent value="lineups" className="mt-4">
              <LineupDisplay
                homeLineup={match.homeLineup || []}
                awayLineup={match.awayLineup || []}
                homeTeamName={match.homeTeam.name}
                awayTeamName={match.awayTeam.name}
              />
            </TabsContent>
          )}

          {/* Media */}
          <TabsContent value="media" className="mt-4">
            <MatchMedia matchId={match._id} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
