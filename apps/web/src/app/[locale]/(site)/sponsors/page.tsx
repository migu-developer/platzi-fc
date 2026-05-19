import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { SPONSORS_QUERY } from '@/lib/sanity/queries'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sponsors y Patrocinadores',
  description:
    'Conoce a los sponsors y patrocinadores oficiales de Platzi FC. Oportunidades de patrocinio.',
}

type Sponsor = {
  _id: string
  name: string
  tier: 'main' | 'official' | 'partner' | 'supplier'
  logo: { asset?: { url: string } }
  url: string
  slug: { current: string }
}

const TIER_ORDER = ['main', 'official', 'partner', 'supplier'] as const

const TIER_LABELS: Record<(typeof TIER_ORDER)[number], string> = {
  main: 'Sponsor Principal',
  official: 'Sponsors Oficiales',
  partner: 'Partners',
  supplier: 'Proveedores',
}

export default async function SponsorsPage() {
  const sponsors = await client
    .fetch<Sponsor[]>(SPONSORS_QUERY, {}, { next: { tags: ['sponsor'] } })
    .catch(() => [])

  const grouped = TIER_ORDER.reduce(
    (acc, tier) => {
      const items = sponsors.filter((s) => s.tier === tier)
      if (items.length > 0) acc[tier] = items
      return acc
    },
    {} as Partial<Record<(typeof TIER_ORDER)[number], Sponsor[]>>,
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Sponsors' }]} />

      <SectionHeader title="Sponsors y Patrocinadores" />

      {sponsors.length > 0 ? (
        <div className="mt-8 space-y-12">
          {TIER_ORDER.map((tier) => {
            const items = grouped[tier]
            if (!items) return null

            if (tier === 'main') {
              return (
                <section key={tier}>
                  <h3 className="font-(family-name:--font-heading) text-xl font-semibold text-club-dark">
                    {TIER_LABELS[tier]}
                  </h3>
                  <div className="mt-4 grid gap-6">
                    {items.map((sponsor) => (
                      <Card key={sponsor._id} className="overflow-hidden">
                        <div className="relative aspect-video bg-muted">
                          {sponsor.logo?.asset?.url ? (
                            <Image
                              src={sponsor.logo.asset.url}
                              alt={sponsor.name}
                              fill
                              className="object-contain p-8"
                              sizes="(max-width: 768px) 100vw, 80vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              {sponsor.name}
                            </div>
                          )}
                        </div>
                        <CardContent className="flex items-center justify-between p-4">
                          <h4 className="font-(family-name:--font-heading) text-lg font-bold text-club-primary">
                            {sponsor.name}
                          </h4>
                          {sponsor.url && (
                            <a
                              href={sponsor.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-medium text-club-primary hover:underline"
                            >
                              Visitar sitio
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )
            }

            return (
              <section key={tier}>
                <h3 className="font-(family-name:--font-heading) text-xl font-semibold text-club-dark">
                  {TIER_LABELS[tier]}
                </h3>
                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((sponsor) => (
                    <Card key={sponsor._id} className="overflow-hidden">
                      <div className="relative flex h-28 items-center justify-center bg-muted p-4">
                        {sponsor.logo?.asset?.url ? (
                          <Image
                            src={sponsor.logo.asset.url}
                            alt={sponsor.name}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {sponsor.name}
                          </span>
                        )}
                      </div>
                      <CardContent className="p-3 text-center">
                        <p className="text-sm font-medium">{sponsor.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="mt-12 rounded-card border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            No hay sponsors registrados por el momento.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            El contenido se cargara desde Sanity CMS una vez configurado el proyecto.
          </p>
        </div>
      )}

      {/* CTA patrocinio */}
      <section className="mt-12 rounded-card bg-club-light p-8">
        <h2 className="font-(family-name:--font-heading) text-xl font-bold text-club-primary">
          Quieres ser sponsor?
        </h2>
        <p className="mt-2 text-gray-600">
          Contacta con nuestro departamento comercial para conocer las oportunidades de
          patrocinio.
        </p>
        <div className="mt-4">
          <Button render={<Link href="/club/contacto" />}>Contactar</Button>
        </div>
      </section>
    </div>
  )
}
