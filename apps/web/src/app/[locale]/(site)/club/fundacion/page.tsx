import type { Metadata } from 'next'
import { CmsPage, getCmsPageMetadata } from '@/components/shared/cms-page'

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata('club-fundacion', 'Fundacion')
}

export default function FundacionPage() {
  return (
    <CmsPage
      section="club-fundacion"
      breadcrumbs={[
        { label: 'Club', href: '/club' },
        { label: 'Fundacion' },
      ]}
      fallbackTitle="Fundacion Platzi FC"
      fallbackDescription="Nuestro compromiso con la comunidad a traves de programas de impacto social."
    />
  )
}
