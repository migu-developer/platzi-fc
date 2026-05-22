import type { Metadata } from 'next'
import { CmsPage, getCmsPageMetadata } from '@/components/shared/cms-page'

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata('club-estadio', 'Estadio')
}

export default function EstadioPage() {
  return (
    <CmsPage
      section="club-estadio"
      breadcrumbs={[{ label: 'Club', href: '/club' }, { label: 'Estadio' }]}
      fallbackTitle="Nuestro Estadio"
      fallbackDescription="Informacion sobre el estadio, como llegar, mapa de accesos y accesibilidad."
    />
  )
}
