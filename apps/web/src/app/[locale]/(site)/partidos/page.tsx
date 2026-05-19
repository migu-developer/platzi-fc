import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { MATCHES_QUERY, SEASONS_QUERY, COMPETITIONS_QUERY } from '@/lib/sanity/queries'
import { MatchCard } from '@/components/match/match-card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { SeasonCompetitionSelector } from '@/components/shared/season-competition-selector'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JsonLd, organizationJsonLd } from '@/components/shared/json-ld'

export const metadata: Metadata = {
  title: 'Calendario y Resultados',
  description:
    'Consulta el calendario de partidos, resultados y proximos encuentros de Platzi FC.',
}

type MatchItem = {
  _id: string
  datetime: string
  status: 'scheduled' | 'live' | 'finished' | 'suspended'
  homeScore?: number
  awayScore?: number
  matchday?: number
  slug: { current: string }
  homeTeam: { _id: string; name: string }
  awayTeam: { _id: string; name: string }
  competition?: { _id: string; name: string; slug?: { current: string } }
  season?: { _id: string; name: string }
}

type SelectorItem = { _id: string; name: string; slug: { current: string } }

type SearchParams = Promise<{ season?: string; competition?: string }>

export default async function PartidosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { season: seasonFilter, competition: competitionFilter } = await searchParams

  const [matches, seasons, competitions] = await Promise.all([
    client.fetch<MatchItem[]>(MATCHES_QUERY, {}, { next: { tags: ['match'] } }).catch(() => []),
    client.fetch<SelectorItem[]>(SEASONS_QUERY, {}, { next: { tags: ['season'] } }).catch(() => []),
    client.fetch<SelectorItem[]>(COMPETITIONS_QUERY, {}, { next: { tags: ['competition'] } }).catch(() => []),
  ])

  // Filter by season/competition
  let filtered = matches
  if (seasonFilter) {
    filtered = filtered.filter((m) => m.season?.name === seasonFilter)
  }
  if (competitionFilter) {
    filtered = filtered.filter((m) => m.competition?.slug?.current === competitionFilter)
  }

  const now = new Date().toISOString()
  const upcoming = filtered
    .filter((m) => m.status === 'scheduled' && m.datetime >= now)
    .sort((a, b) => a.datetime.localeCompare(b.datetime))
  const results = filtered
    .filter((m) => m.status === 'finished' || m.status === 'suspended')
    .sort((a, b) => b.datetime.localeCompare(a.datetime))
  const live = filtered.filter((m) => m.status === 'live')

  const renderMatchGrid = (items: MatchItem[], emptyMsg: string) =>
    items.length > 0 ? (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <MatchCard
            key={m._id}
            slug={m.slug.current}
            datetime={m.datetime}
            status={m.status}
            homeTeam={{ name: m.homeTeam.name }}
            awayTeam={{ name: m.awayTeam.name }}
            homeScore={m.homeScore}
            awayScore={m.awayScore}
            competition={m.competition?.name}
            matchday={m.matchday}
          />
        ))}
      </div>
    ) : (
      <div className="mt-6 rounded-card border border-dashed border-border p-8 text-center text-muted-foreground">
        {emptyMsg}
      </div>
    )

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Partidos' }]} />

        <SectionHeader
          title="Calendario y Resultados"
          description="Todos los partidos de la temporada"
        />

        {/* Season/Competition selector */}
        {(seasons.length > 0 || competitions.length > 0) && (
          <div className="mt-6">
            <SeasonCompetitionSelector
              seasons={seasons}
              competitions={competitions}
              currentSeason={seasonFilter}
              currentCompetition={competitionFilter}
            />
          </div>
        )}

        {/* Live matches banner */}
        {live.length > 0 && (
          <section className="mt-6">
            <h2 className="font-(family-name:--font-heading) text-lg font-bold text-red-600">
              En Vivo
            </h2>
            {renderMatchGrid(live, '')}
          </section>
        )}

        <Tabs defaultValue="upcoming" className="mt-8">
          <TabsList>
            <TabsTrigger value="upcoming">
              Proximos ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="results">
              Resultados ({results.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {renderMatchGrid(upcoming, 'No hay partidos programados por el momento.')}
          </TabsContent>

          <TabsContent value="results">
            {renderMatchGrid(results, 'No hay resultados disponibles por el momento.')}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
