import type { Metadata } from 'next'
import { CmsPage, getCmsPageMetadata } from '@/components/shared/cms-page'

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata('academia', 'Academia — Platzi FC Lab')
}

export default function AcademiaPage() {
  return (
    <CmsPage
      section="academia"
      breadcrumbs={[{ label: 'Academia' }]}
      fallbackTitle="Academia — Platzi FC Lab"
      fallbackDescription="Programas formativos, cantera y desarrollo de talento en Platzi FC."
    />
  )
}
