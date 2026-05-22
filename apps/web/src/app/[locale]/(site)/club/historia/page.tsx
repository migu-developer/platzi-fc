import type { Metadata } from 'next'
import { CmsPage, getCmsPageMetadata } from '@/components/shared/cms-page'

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata('club-historia', 'Historia del Club')
}

export default function HistoriaPage() {
  return (
    <CmsPage
      section="club-historia"
      breadcrumbs={[{ label: 'Club', href: '/club' }, { label: 'Historia' }]}
      fallbackTitle="Historia del Club"
      fallbackDescription="Conoce la trayectoria y los hitos mas importantes de Platzi FC desde su fundacion."
    />
  )
}
