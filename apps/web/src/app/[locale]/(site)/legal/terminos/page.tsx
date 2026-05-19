import type { Metadata } from 'next'
import { CmsPage, getCmsPageMetadata } from '@/components/shared/cms-page'

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata('legal-terminos', 'Terminos y Condiciones')
}

export default function TerminosPage() {
  return (
    <CmsPage
      section="legal-terminos"
      breadcrumbs={[
        { label: 'Legal' },
        { label: 'Terminos y Condiciones' },
      ]}
      fallbackTitle="Terminos y Condiciones"
      fallbackDescription="Terminos y condiciones de uso del sitio web oficial de Platzi FC."
    />
  )
}
