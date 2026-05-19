import type { Metadata } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity/client'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { PortableText } from '@/components/shared/portable-text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils/format'
import { CalendarDays, MapPin, Users, Star, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fans y Socios',
  description:
    'Unete a la comunidad de Platzi FC. Beneficios exclusivos, eventos y mas para nuestros socios.',
}

// ─── Types ───────────────────────────────────────────────

type MembershipPlan = {
  _id: string
  name: string
  level: number
  benefits: unknown[] | null
  priceRef: string | null
  checkoutUrl: string | null
  slug: { current: string } | null
}

type FanEvent = {
  _id: string
  name: string
  datetime: string
  location: string | null
  type: string | null
  registrationUrl: string | null
  capacity: number | null
}

// ─── Queries ─────────────────────────────────────────────

const MEMBERSHIP_PLANS_QUERY = groq`
  *[_type == "membershipPlan"] | order(level asc) {
    _id, name, level, benefits, priceRef, checkoutUrl, slug
  }
`

const FAN_EVENTS_QUERY = groq`
  *[_type == "fanEvent" && datetime > now()] | order(datetime asc) [0..5] {
    _id, name, datetime, location, type, registrationUrl, capacity
  }
`

// ─── Helpers ─────────────────────────────────────────────

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-gray-500 text-white',
  2: 'bg-club-secondary text-club-dark',
  3: 'bg-club-primary text-white',
}

function levelLabel(level: number): string {
  switch (level) {
    case 1:
      return 'Basico'
    case 2:
      return 'Premium'
    case 3:
      return 'VIP'
    default:
      return `Nivel ${level}`
  }
}

// ─── Page ────────────────────────────────────────────────

export default async function FansPage() {
  const [plans, events] = await Promise.all([
    client
      .fetch<MembershipPlan[]>(MEMBERSHIP_PLANS_QUERY, {}, { next: { tags: ['membershipPlan'] } })
      .catch(() => [] as MembershipPlan[]),
    client
      .fetch<FanEvent[]>(FAN_EVENTS_QUERY, {}, { next: { tags: ['fanEvent'] } })
      .catch(() => [] as FanEvent[]),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Fans y Socios' }]} />

      <SectionHeader
        title="Fans y Socios"
        description="Unete a la comunidad de Platzi FC"
      />

      {/* ── Hero Banner ────────────────────────────────── */}
      <section className="mt-8 rounded-xl bg-club-primary px-6 py-12 text-center text-white sm:px-12">
        <h2 className="font-(family-name:--font-heading) text-3xl font-bold md:text-4xl">
          Se parte de Platzi FC
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-white/80">
          Accede a beneficios exclusivos, descuentos en la tienda, entradas
          preferenciales y mucho mas siendo socio del club.
        </p>
        <div className="mt-6">
          <Button
            size="lg"
            className="bg-club-secondary text-club-dark hover:bg-club-secondary-light"
            render={<a href="#planes" />}
          >
            Ver planes de membresia
          </Button>
        </div>
      </section>

      {/* ── Membership Plans ───────────────────────────── */}
      <section id="planes" className="mt-12">
        <SectionHeader title="Planes de Membresia" />

        {plans.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-(family-name:--font-heading) text-lg font-bold">
                      {plan.name}
                    </CardTitle>
                    <Badge
                      className={
                        LEVEL_COLORS[plan.level] ?? 'bg-muted text-foreground'
                      }
                    >
                      {levelLabel(plan.level)}
                    </Badge>
                  </div>
                  {plan.priceRef && (
                    <CardDescription className="mt-1 text-base font-semibold text-club-primary">
                      {plan.priceRef}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="flex-1">
                  {plan.benefits ? (
                    <PortableText value={plan.benefits} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Los beneficios se detallaran proximamente.
                    </p>
                  )}
                </CardContent>

                {plan.checkoutUrl && (
                  <CardFooter>
                    <Button
                      className="w-full bg-club-primary text-white hover:bg-club-primary-light"
                      render={
                        <a
                          href={plan.checkoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      Hacerse socio
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-card border border-dashed border-border p-12 text-center">
            <Star className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">
              Los planes de membresia se cargaran desde Sanity CMS.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crea documentos de tipo &quot;membershipPlan&quot; en el Studio.
            </p>
          </div>
        )}
      </section>

      {/* ── Upcoming Events ────────────────────────────── */}
      <section className="mt-12">
        <SectionHeader title="Proximos Eventos" />

        {events.length > 0 ? (
          <div className="mt-6 space-y-4">
            {events.map((event) => (
              <Card key={event._id} className="flex flex-col gap-0 sm:flex-row sm:items-center sm:justify-between">
                <CardContent className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span>{formatDateTime(event.datetime)}</span>
                  </div>

                  <h3 className="font-(family-name:--font-heading) text-base font-semibold">
                    {event.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                    {event.location && (
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                    )}
                    {event.capacity != null && (
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {event.capacity} plazas
                      </span>
                    )}
                    {event.type && (
                      <Badge variant="secondary">{event.type}</Badge>
                    )}
                  </div>
                </CardContent>

                {event.registrationUrl && (
                  <CardContent className="shrink-0">
                    <Button
                      variant="outline"
                      render={
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      Inscribirse
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-card border border-dashed border-border p-12 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">
              No hay eventos proximos programados.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Los eventos para fans se cargaran desde Sanity CMS.
            </p>
          </div>
        )}
      </section>

      {/* ── Newsletter CTA ─────────────────────────────── */}
      <section className="mt-12 rounded-xl bg-club-light p-8 text-center">
        <div className="mx-auto max-w-xl">
          <Mail className="mx-auto h-8 w-8 text-club-primary" />
          <h2 className="font-(family-name:--font-heading) mt-3 text-xl font-bold text-club-primary">
            Mantente informado
          </h2>
          <p className="mt-2 text-gray-600">
            Suscribete a nuestra newsletter para recibir noticias, resultados y
            ofertas exclusivas para socios.
          </p>
          <div className="mt-4">
            <Button
              className="bg-club-primary text-white hover:bg-club-primary-light"
              render={<a href="#footer-newsletter" />}
            >
              Suscribirme al newsletter
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
