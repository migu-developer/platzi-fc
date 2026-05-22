import type { Metadata } from 'next'
import { CmsPage, getCmsPageMetadata } from '@/components/shared/cms-page'

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata('legal-accesibilidad', 'Accesibilidad')
}

export default function AccesibilidadPage() {
  return (
    <CmsPage
      section="legal-accesibilidad"
      breadcrumbs={[{ label: 'Legal' }, { label: 'Accesibilidad' }]}
      fallbackTitle="Declaracion de Accesibilidad"
      fallbackDescription="Nuestro compromiso con la accesibilidad web y las medidas que implementamos."
    />
  )
}
