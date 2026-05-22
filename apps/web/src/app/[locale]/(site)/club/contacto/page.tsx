import type { Metadata } from 'next'
import { CmsPage, getCmsPageMetadata } from '@/components/shared/cms-page'

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata('club-contacto', 'Contacto')
}

export default function ContactoPage() {
  return (
    <CmsPage
      section="club-contacto"
      breadcrumbs={[{ label: 'Club', href: '/club' }, { label: 'Contacto' }]}
      fallbackTitle="Contacto"
      fallbackDescription="Ponte en contacto con Platzi FC. Prensa, sponsors, consultas generales."
    />
  )
}
