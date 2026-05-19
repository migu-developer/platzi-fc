import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import {
  COMPETITION_BY_SLUG_QUERY,
  MATCHES_BY_COMPETITION_QUERY,
} from '@/lib/sanity/queries'
import { MatchCard } from '@/components/match/match-card'
import { StandingsTable } from '@/components/match/standings-table'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { groq } from 'next-sanity'

type Props = { params: Promise<{ slug: string }> }

type CompetitionData = {
  _id: string
  name: string
  type: string
  country?: string
  slug: { current: string }
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
  competition?: { _id: string; name: string }
  season?: { _id: string; name: string }
}

type StandingsData = {
  _id: string
  rows: Array<{
    team: { name: string; badge?: { asset?: { url: string } }; slug?: { current: string } }
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    goalDifference: number
    points: number
    form?: string[]
  }>
} | null

async function getCompetition(slug: string) {
  return client
    .fetch<CompetitionData | null>(COMPETITION_BY_SLUG_QUERY, { slug }, { next: { tags: ['competition'] } })
    .catch(() => null)
}

async function getStandingsForCompetition(competitionId: string) {
  return client
    .fetch<StandingsData>(
      groq`*[_type == "standings" && competition._ref == $competitionId][0] {
        _id,
        rows[] {
          played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points, form,
          "team": team-> { name, badge, slug }
        }
      }`,
      { competitionId },
      { next: { tags: ['standings'] } },
    )
    .catch(() => null)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const competition = await getCompetition(slug)
  if (!competition) return { title: 'Competicion no encontrada' }
  return {
    title: competition.name,
    description: `Clasificacion, calendario y estadisticas de Platzi FC en ${competition.name}.`,
  }
}

export default async function CompeticionDetailPage({ params }: Props) {
  const { slug } = await params
  const competition = await getCompetition(slug)
  if (!competition) notFound()

  const [matches, standings] = await Promise.all([
    client
      .fetch<MatchItem[]>(MATCHES_BY_COMPETITION_QUERY, { competitionSlug: slug }, { next: { tags: ['match'] } })
      .catch(() => []),
    getStandingsForCompetition(competition._id),
  ])

  const results = matches.filter((m) => m.status === 'finished')
  const upcoming = matches.filter((m) => m.status === 'scheduled')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Partidos', href: '/partidos' },
          { label: competition.name },
        ]}
      />

      <SectionHeader
        title={competition.name}
        description={`${competition.type === 'league' ? 'Liga' : competition.type === 'cup' ? 'Copa' : 'Amistoso'}${competition.country ? ` — ${competition.country}` : ''}`}
      />

      <Tabs defaultValue="standings" className="mt-8">
        <TabsList>
          <TabsTrigger value="standings">Clasificacion</TabsTrigger>
          <TabsTrigger value="results">Resultados ({results.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Proximos ({upcoming.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="mt-4">
          {standings?.rows && standings.rows.length > 0 ? (
            <StandingsTable rows={standings.rows} highlightTeam="Platzi FC" />
          ) : (
            <div className="rounded-card border border-dashed border-border p-8 text-center text-muted-foreground">
              La tabla de clasificacion se cargara desde Sanity CMS.
            </div>
          )}
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          {results.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((m) => (
                <MatchCard
                  key={m._id}
                  slug={m.slug.current}
                  datetime={m.datetime}
                  status={m.status}
                  homeTeam={{ name: m.homeTeam.name }}
                  awayTeam={{ name: m.awayTeam.name }}
                  homeScore={m.homeScore}
                  awayScore={m.awayScore}
                  competition={competition.name}
                  matchday={m.matchday}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-border p-8 text-center text-muted-foreground">
              No hay resultados en esta competicion.
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((m) => (
                <MatchCard
                  key={m._id}
                  slug={m.slug.current}
                  datetime={m.datetime}
                  status={m.status}
                  homeTeam={{ name: m.homeTeam.name }}
                  awayTeam={{ name: m.awayTeam.name }}
                  competition={competition.name}
                  matchday={m.matchday}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-dashed border-border p-8 text-center text-muted-foreground">
              No hay partidos programados en esta competicion.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
