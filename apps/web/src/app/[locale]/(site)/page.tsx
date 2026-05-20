import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/shared/section-header'
import { JsonLd, organizationJsonLd } from '@/components/shared/json-ld'
import { Ticket, ShoppingBag, Play, Trophy, Users, Newspaper } from 'lucide-react'
import { LiveMatchBanner } from '@/components/match/live-match-banner'

export const metadata: Metadata = {
  title: 'Platzi FC — Sitio Oficial',
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <LiveMatchBanner />

      {/* Hero — Proximo partido */}
      <section className="relative overflow-hidden bg-club-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-club-primary-light)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Badge className="mb-4 bg-club-secondary text-club-dark">Proximo Partido</Badge>
          <h1 className="font-(family-name:--font-heading) text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Platzi FC
          </h1>
          <p className="mt-3 max-w-xl text-lg text-club-accent">
            Bienvenido al sitio oficial del club. Consulta partidos, noticias, entradas y mucho mas.
          </p>

          {/* Placeholder next match widget */}
          <div className="mt-8 inline-flex items-center gap-6 rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm">
            <div className="text-center">
              <p className="font-(family-name:--font-heading) text-lg font-bold text-white">
                Platzi FC
              </p>
            </div>
            <div className="text-center">
              <p className="font-(family-name:--font-heading) text-2xl font-bold text-club-secondary">
                vs
              </p>
              <p className="text-xs text-club-accent">Proximamente</p>
            </div>
            <div className="text-center">
              <p className="font-(family-name:--font-heading) text-lg font-bold text-white">
                Rival FC
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href="/entradas" />}
              size="lg"
              className="bg-club-secondary text-club-dark hover:bg-club-secondary-light"
            >
              <Ticket className="mr-2 h-4 w-4" />
              Comprar Entradas
            </Button>
            <Button
              render={<Link href="/partidos" />}
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Ver Calendario
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
        {/* Quick links grid */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Partidos',
                desc: 'Calendario y resultados',
                href: '/partidos',
                icon: Trophy,
                color: 'text-emerald-600',
              },
              {
                title: 'Equipo',
                desc: 'Plantilla y cuerpo tecnico',
                href: '/equipo',
                icon: Users,
                color: 'text-blue-600',
              },
              {
                title: 'Noticias',
                desc: 'Ultimas novedades',
                href: '/noticias',
                icon: Newspaper,
                color: 'text-orange-600',
              },
              {
                title: 'Media',
                desc: 'Videos y galerias',
                href: '/media',
                icon: Play,
                color: 'text-purple-600',
              },
              {
                title: 'Entradas',
                desc: 'Compra tus entradas',
                href: '/entradas',
                icon: Ticket,
                color: 'text-red-600',
              },
              {
                title: 'Tienda',
                desc: 'Merchandising oficial',
                href: '/tienda',
                icon: ShoppingBag,
                color: 'text-amber-600',
              },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="group transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="rounded-lg bg-muted p-2.5">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <h2 className="font-(family-name:--font-heading) text-base font-bold group-hover:text-club-primary">
                        {item.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Noticias destacadas */}
        <section>
          <SectionHeader
            title="Ultimas Noticias"
            description="Novedades del club"
            viewAllHref="/noticias"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    Club
                  </Badge>
                  <h3 className="font-(family-name:--font-heading) text-sm font-bold">
                    Noticia de ejemplo {i}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Contenido de ejemplo que sera reemplazado por datos de Sanity CMS
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Posicion en la tabla */}
        <section>
          <SectionHeader
            title="Clasificacion"
            description="Posicion actual en la liga"
            viewAllHref="/competicion/liga"
            viewAllLabel="Tabla completa"
          />
          <Card className="mt-6">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">Equipo</th>
                      <th className="px-4 py-3 text-center font-medium">PJ</th>
                      <th className="px-4 py-3 text-center font-medium">PG</th>
                      <th className="px-4 py-3 text-center font-medium">PE</th>
                      <th className="px-4 py-3 text-center font-medium">PP</th>
                      <th className="px-4 py-3 text-center font-medium">DG</th>
                      <th className="px-4 py-3 text-center font-medium">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        pos: 1,
                        name: 'Platzi FC',
                        pj: 10,
                        pg: 7,
                        pe: 2,
                        pp: 1,
                        dg: '+12',
                        pts: 23,
                        highlight: true,
                      },
                      {
                        pos: 2,
                        name: 'Equipo B',
                        pj: 10,
                        pg: 6,
                        pe: 3,
                        pp: 1,
                        dg: '+8',
                        pts: 21,
                        highlight: false,
                      },
                      {
                        pos: 3,
                        name: 'Equipo C',
                        pj: 10,
                        pg: 6,
                        pe: 2,
                        pp: 2,
                        dg: '+6',
                        pts: 20,
                        highlight: false,
                      },
                    ].map((row) => (
                      <tr
                        key={row.pos}
                        className={`border-b last:border-0 ${row.highlight ? 'bg-club-light font-semibold' : ''}`}
                      >
                        <td className="px-4 py-3">{row.pos}</td>
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3 text-center">{row.pj}</td>
                        <td className="px-4 py-3 text-center">{row.pg}</td>
                        <td className="px-4 py-3 text-center">{row.pe}</td>
                        <td className="px-4 py-3 text-center">{row.pp}</td>
                        <td className="px-4 py-3 text-center">{row.dg}</td>
                        <td className="px-4 py-3 text-center font-bold">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Tienda + Entradas */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="overflow-hidden border-club-primary bg-club-primary text-white">
            <CardContent className="flex flex-col items-start gap-4 p-6">
              <Ticket className="h-8 w-8 text-club-secondary" />
              <div>
                <h2 className="font-(family-name:--font-heading) text-xl font-bold">Entradas</h2>
                <p className="mt-1 text-sm text-club-accent">
                  Asegura tu lugar en el proximo partido
                </p>
              </div>
              <Button
                render={<Link href="/entradas" />}
                className="mt-2 bg-club-secondary text-club-dark hover:bg-club-secondary-light"
              >
                Comprar Entradas
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-club-secondary bg-club-light">
            <CardContent className="flex flex-col items-start gap-4 p-6">
              <ShoppingBag className="h-8 w-8 text-club-primary" />
              <div>
                <h2 className="font-(family-name:--font-heading) text-xl font-bold text-club-dark">
                  Tienda Oficial
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Camisetas, accesorios y mas</p>
              </div>
              <Button
                render={<Link href="/tienda" />}
                className="mt-2 bg-club-primary text-white hover:bg-club-primary-light"
              >
                Ir a la Tienda
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  )
}
