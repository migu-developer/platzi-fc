import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { CartContent } from './cart-content'

export const metadata: Metadata = {
  title: 'Carrito',
  description: 'Tu carrito de compras en Platzi FC.',
}

export default function CarritoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Carrito' }]} />
      <SectionHeader title="Carrito" description="Revisa tus productos antes de continuar" />
      <div className="mt-8">
        <CartContent />
      </div>
    </div>
  )
}
