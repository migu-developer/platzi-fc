import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { PLAYERS_QUERY, STAFF_QUERY } from '@/lib/sanity/queries'
import { PlayerCard } from '@/components/team/player-card'
import { StaffCard } from '@/components/team/staff-card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { FilterBar } from '@/components/shared/filter-bar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JsonLd, sportsTeamJsonLd } from '@/components/shared/json-ld'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com'

export const metadata: Metadata = {
  title: 'Plantilla',
  description:
    'Conoce a los jugadores y cuerpo tecnico de Platzi FC. Plantilla completa de la temporada.',
}

type PlayerItem = {
  _id: string
  firstName: string
  lastName: string
  number?: number
  position: string
  nationality?: string
  photo?: { asset?: { url: string } }
  status: string
  slug: { current: string }
}

type StaffItem = {
  _id: string
  name: string
  role: string
  photo?: { asset?: { url: string } }
  slug: { current: string }
}

const POSITION_ORDER = ['goalkeeper', 'defender', 'midfielder', 'forward']
const POSITION_LABELS: Record<string, string> = {
  goalkeeper: 'Porteros',
  defender: 'Defensas',
  midfielder: 'Centrocampistas',
  forward: 'Delanteros',
}

type SearchParams = Promise<{ position?: string }>

export default async function EquipoPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { position } = await searchParams

  const [players, staffList] = await Promise.all([
    client.fetch<PlayerItem[]>(PLAYERS_QUERY, {}, { next: { tags: ['player'] } }).catch(() => []),
    client.fetch<StaffItem[]>(STAFF_QUERY, {}, { next: { tags: ['staff'] } }).catch(() => []),
  ])

  const filteredPlayers = position
    ? players.filter((p) => p.position === position)
    : players

  const grouped = POSITION_ORDER.map((pos) => ({
    position: pos,
    label: POSITION_LABELS[pos],
    players: filteredPlayers.filter((p) => p.position === pos),
  })).filter((g) => g.players.length > 0)

  const positionOptions = POSITION_ORDER.map((pos) => ({
    label: POSITION_LABELS[pos],
    value: pos,
  }))

  return (
    <>
      <JsonLd data={sportsTeamJsonLd({ name: 'Platzi FC', url: `${SITE_URL}/equipo`, sport: 'Football' })} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Equipo' }]} />

        <SectionHeader
          title="Plantilla"
          description="Primer equipo y cuerpo tecnico de Platzi FC"
        />

        <Tabs defaultValue="players" className="mt-8">
          <TabsList>
            <TabsTrigger value="players">Jugadores ({players.length})</TabsTrigger>
            <TabsTrigger value="staff">Cuerpo Tecnico ({staffList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="players" className="mt-6">
            <FilterBar paramName="position" options={positionOptions} allLabel="Todas las posiciones" />

            {grouped.length > 0 ? (
              <div className="mt-6 space-y-10">
                {grouped.map((group) => (
                  <section key={group.position}>
                    <h2 className="font-(family-name:--font-heading) text-lg font-bold">
                      {group.label}
                    </h2>
                    <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {group.players.map((player) => (
                        <PlayerCard
                          key={player._id}
                          slug={player.slug.current}
                          firstName={player.firstName}
                          lastName={player.lastName}
                          number={player.number}
                          position={player.position}
                          nationality={player.nationality}
                          photo={
                            player.photo?.asset?.url
                              ? { url: player.photo.asset.url, alt: `${player.firstName} ${player.lastName}` }
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-card border border-dashed border-border p-8 text-center text-muted-foreground">
                {position
                  ? 'No hay jugadores en esta posicion.'
                  : 'La plantilla se cargara desde Sanity CMS.'}
              </div>
            )}
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            {staffList.length > 0 ? (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {staffList.map((s) => (
                  <StaffCard
                    key={s._id}
                    slug={s.slug.current}
                    name={s.name}
                    role={s.role}
                    photo={s.photo}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-card border border-dashed border-border p-8 text-center text-muted-foreground">
                El cuerpo tecnico se cargara desde Sanity CMS.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
