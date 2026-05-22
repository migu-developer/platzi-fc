import type { Metadata } from 'next'
import { CmsPage, getCmsPageMetadata } from '@/components/shared/cms-page'

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata('legal-privacidad', 'Politica de Privacidad')
}

export default function PrivacidadPage() {
  return (
    <CmsPage
      section="legal-privacidad"
      breadcrumbs={[{ label: 'Legal' }, { label: 'Politica de Privacidad' }]}
      fallbackTitle="Politica de Privacidad"
      fallbackDescription="Como Platzi FC recopila, utiliza y protege tu informacion personal."
    />
  )
}
