import type { Metadata } from 'next'
import Link from 'next/link'
import { Landmark, MapPin, Heart, Mail, FileText, Users, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'

export const metadata: Metadata = {
  title: 'Club',
  description:
    'Conoce Platzi FC: historia, estadio, fundacion, contacto y todo sobre nuestro club.',
}

type ClubSection = {
  title: string
  href: string
  desc: string
  icon: LucideIcon
}

const CLUB_SECTIONS: ClubSection[] = [
  {
    title: 'Historia',
    href: '/club/historia',
    desc: 'Los origenes y la trayectoria del club desde su fundacion.',
    icon: Landmark,
  },
  {
    title: 'Estadio',
    href: '/club/estadio',
    desc: 'Nuestro hogar: informacion, como llegar y servicios.',
    icon: MapPin,
  },
  {
    title: 'Fundacion',
    href: '/club/fundacion',
    desc: 'Compromiso social y proyectos de la fundacion Platzi FC.',
    icon: Heart,
  },
  {
    title: 'Contacto',
    href: '/club/contacto',
    desc: 'Ponte en contacto con nosotros.',
    icon: Mail,
  },
  {
    title: 'Transparencia',
    href: '/club/historia',
    desc: 'Informes financieros y gobierno corporativo.',
    icon: FileText,
  },
  {
    title: 'Directiva',
    href: '/club/historia',
    desc: 'Conoce a quienes dirigen el club.',
    icon: Users,
  },
]

export default function ClubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Club' }]} />
      <SectionHeader title="Club" description="Todo sobre Platzi FC" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CLUB_SECTIONS.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.title} href={section.href}>
              <Card className="h-full transition-shadow hover:border-club-primary hover:shadow-md">
                <CardContent className="flex flex-col gap-3 p-6">
                  <Icon className="h-8 w-8 text-club-primary" />
                  <h3 className="font-(family-name:--font-heading) text-lg font-bold">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{section.desc}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
