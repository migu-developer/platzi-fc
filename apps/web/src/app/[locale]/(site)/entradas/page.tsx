import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { TICKET_PRODUCTS_QUERY } from '@/lib/sanity/queries'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { TicketCta } from '@/components/commerce/ticket-cta'
import { formatDateTime } from '@/lib/utils/format'
import { Ticket, MapPin, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Entradas',
  description:
    'Compra tus entradas para los partidos de Platzi FC. Abonos, entradas individuales y packs.',
}

type TicketItem = {
  _id: string
  name: string
  type: 'match' | 'season_pass' | 'membership'
  checkoutUrl: string
  zones?: string[]
  match?: {
    _id: string
    datetime: string
    slug: { current: string }
    homeTeam: { name: string }
    awayTeam: { name: string }
  }
}

const TYPE_LABELS: Record<string, string> = {
  match: 'Partido',
  season_pass: 'Abono',
  membership: 'Membresia',
}

export default async function EntradasPage() {
  const tickets = await client
    .fetch<TicketItem[]>(TICKET_PRODUCTS_QUERY, {}, { next: { tags: ['ticketProduct'] } })
    .catch(() => [])

  const matchTickets = tickets.filter((t) => t.type === 'match' && t.match)
  const otherTickets = tickets.filter((t) => t.type !== 'match')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Entradas' }]} />

      <SectionHeader
        title="Entradas"
        description="Consigue tus entradas para los proximos partidos de Platzi FC"
      />

      {/* Match tickets */}
      <section className="mt-8">
        <h2 className="font-(family-name:--font-heading) text-lg font-bold">
          Entradas para partidos
        </h2>
        {matchTickets.length > 0 ? (
          <div className="mt-4 space-y-3">
            {matchTickets.map((t) => (
              <TicketCta
                key={t._id}
                matchLabel={`${t.match!.homeTeam.name} vs ${t.match!.awayTeam.name}`}
                datetime={formatDateTime(t.match!.datetime)}
                checkoutUrl={t.checkoutUrl}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-card border border-dashed border-border p-8 text-center text-muted-foreground">
            No hay entradas disponibles por el momento. Los productos de entradas se gestionan desde Sanity CMS.
          </div>
        )}
      </section>

      {/* Abonos y membresias */}
      {otherTickets.length > 0 && (
        <section className="mt-10">
          <h2 className="font-(family-name:--font-heading) text-lg font-bold">
            Abonos y Membresias
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherTickets.map((t) => (
              <Card key={t._id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <Badge variant="secondary">{TYPE_LABELS[t.type] || t.type}</Badge>
                  <h3 className="mt-2 font-(family-name:--font-heading) text-base font-bold">
                    {t.name}
                  </h3>
                  {t.zones && t.zones.length > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Zonas: {t.zones.join(', ')}
                    </p>
                  )}
                  <Button
                    render={<a href={t.checkoutUrl} target="_blank" rel="noopener noreferrer" />}
                    className="mt-4 w-full bg-club-primary text-white hover:bg-club-primary-light"
                  >
                    Comprar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Info cards */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-club-primary" />
            <div>
              <h3 className="text-sm font-semibold">Entradas digitales</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Recibe tus entradas directamente en tu movil
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-club-primary" />
            <div>
              <h3 className="text-sm font-semibold">Info del estadio</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <Link href="/club/estadio" className="text-club-primary hover:underline">
                  Como llegar y accesos
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-club-primary" />
            <div>
              <h3 className="text-sm font-semibold">Necesitas ayuda?</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                <Link href="/club/contacto" className="text-club-primary hover:underline">
                  Contacta con nosotros
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
