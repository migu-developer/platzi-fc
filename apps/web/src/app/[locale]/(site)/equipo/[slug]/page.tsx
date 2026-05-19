import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { PLAYER_BY_SLUG_QUERY } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PortableText } from '@/components/shared/portable-text'
import { JsonLd, personJsonLd } from '@/components/shared/json-ld'

type Props = { params: Promise<{ slug: string }> }

type PlayerData = {
  _id: string
  firstName: string
  lastName: string
  number?: number
  position: string
  dateOfBirth?: string
  nationality?: string
  height?: number
  weight?: number
  foot?: string
  photo?: { asset: { _ref: string; url: string } }
  bio?: unknown[]
  status: string
  clubHistory?: Array<{ clubName: string; from?: string; to?: string }>
  statsBySeason?: Array<{
    season?: { name: string }
    competition?: { name: string }
    appearances: number
    goals: number
    assists: number
    yellowCards: number
    redCards: number
    minutesPlayed: number
  }>
  socialLinks?: Array<{ platform: string; url: string }>
  slug: { current: string }
  team?: { _id: string; name: string }
}

const POSITION_LABELS: Record<string, string> = {
  goalkeeper: 'Portero',
  defender: 'Defensa',
  midfielder: 'Centrocampista',
  forward: 'Delantero',
}

const FOOT_LABELS: Record<string, string> = { left: 'Izquierdo', right: 'Derecho', both: 'Ambidiestro' }

async function getPlayer(slug: string) {
  return client
    .fetch<PlayerData | null>(PLAYER_BY_SLUG_QUERY, { slug }, { next: { tags: ['player'] } })
    .catch(() => null)
}

function calculateAge(dob: string): number {
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const player = await getPlayer(slug)
  if (!player) return { title: 'Jugador no encontrado' }
  const name = `${player.firstName} ${player.lastName}`
  return {
    title: name,
    description: `Perfil, estadisticas y trayectoria de ${name} en Platzi FC.`,
    openGraph: {
      title: name,
      ...(player.photo?.asset?.url ? { images: [{ url: player.photo.asset.url }] } : {}),
    },
  }
}

export default async function JugadorDetailPage({ params }: Props) {
  const { slug } = await params
  const player = await getPlayer(slug)
  if (!player) notFound()

  const fullName = `${player.firstName} ${player.lastName}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com'

  const infoFields = [
    { label: 'Posicion', value: POSITION_LABELS[player.position] || player.position },
    player.number != null ? { label: 'Dorsal', value: `#${player.number}` } : null,
    player.nationality ? { label: 'Nacionalidad', value: player.nationality } : null,
    player.dateOfBirth ? { label: 'Edad', value: `${calculateAge(player.dateOfBirth)} anos` } : null,
    player.height ? { label: 'Altura', value: `${player.height} cm` } : null,
    player.weight ? { label: 'Peso', value: `${player.weight} kg` } : null,
    player.foot ? { label: 'Pie Habil', value: FOOT_LABELS[player.foot] || player.foot } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <>
      <JsonLd
        data={personJsonLd({
          name: fullName,
          url: `${siteUrl}/equipo/${player.slug.current}`,
          image: player.photo?.asset?.url,
          jobTitle: POSITION_LABELS[player.position],
          nationality: player.nationality,
        })}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Equipo', href: '/equipo' },
            { label: fullName },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Photo */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-muted">
              {player.photo?.asset ? (
                <Image
                  src={urlFor(player.photo).width(400).height(533).url()}
                  alt={fullName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-(family-name:--font-heading) text-6xl font-bold text-muted-foreground/20">
                    {player.number ?? '?'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              {player.number != null && (
                <span className="font-(family-name:--font-heading) text-4xl font-bold text-club-primary/30">
                  #{player.number}
                </span>
              )}
              <div>
                <h1 className="font-(family-name:--font-heading) text-3xl font-bold">{fullName}</h1>
                <Badge className="mt-1">{POSITION_LABELS[player.position] || player.position}</Badge>
              </div>
            </div>

            {/* Stats grid */}
            <dl className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3">
              {infoFields.map((f) => (
                <Card key={f.label}>
                  <CardContent className="p-3">
                    <dt className="text-xs text-muted-foreground">{f.label}</dt>
                    <dd className="mt-0.5 font-semibold">{f.value}</dd>
                  </CardContent>
                </Card>
              ))}
            </dl>

            {/* Bio */}
            {player.bio && player.bio.length > 0 && (
              <section className="mt-8">
                <h2 className="font-(family-name:--font-heading) text-lg font-bold">Biografia</h2>
                <PortableText value={player.bio} className="mt-3" />
              </section>
            )}

            {/* Season stats table */}
            {player.statsBySeason && player.statsBySeason.length > 0 && (
              <section className="mt-8">
                <h2 className="font-(family-name:--font-heading) text-lg font-bold">Estadisticas</h2>
                <Card className="mt-3">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50 text-left">
                            <th className="px-3 py-2 font-medium">Temporada</th>
                            <th className="px-3 py-2 text-center font-medium">PJ</th>
                            <th className="px-3 py-2 text-center font-medium">Goles</th>
                            <th className="px-3 py-2 text-center font-medium">Asist.</th>
                            <th className="px-3 py-2 text-center font-medium">TA</th>
                            <th className="px-3 py-2 text-center font-medium">TR</th>
                            <th className="px-3 py-2 text-center font-medium">Min</th>
                          </tr>
                        </thead>
                        <tbody>
                          {player.statsBySeason.map((s, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="px-3 py-2">{s.season?.name || '—'}</td>
                              <td className="px-3 py-2 text-center">{s.appearances}</td>
                              <td className="px-3 py-2 text-center font-semibold">{s.goals}</td>
                              <td className="px-3 py-2 text-center">{s.assists}</td>
                              <td className="px-3 py-2 text-center">{s.yellowCards}</td>
                              <td className="px-3 py-2 text-center">{s.redCards}</td>
                              <td className="px-3 py-2 text-center">{s.minutesPlayed}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Club history */}
            {player.clubHistory && player.clubHistory.length > 0 && (
              <section className="mt-8">
                <h2 className="font-(family-name:--font-heading) text-lg font-bold">Trayectoria</h2>
                <div className="mt-3 space-y-2">
                  {player.clubHistory.map((club, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                      <span className="font-medium">{club.clubName}</span>
                      <span className="text-muted-foreground">
                        {club.from || '?'} — {club.to || 'Presente'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Social links */}
            {player.socialLinks && player.socialLinks.length > 0 && (
              <section className="mt-8">
                <h2 className="font-(family-name:--font-heading) text-lg font-bold">Redes Sociales</h2>
                <div className="mt-3 flex gap-3">
                  {player.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-border px-3 py-1.5 text-sm capitalize text-muted-foreground hover:border-club-primary hover:text-club-primary"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
