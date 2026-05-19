import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pagina no encontrada',
}

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-(family-name:--font-heading) text-9xl font-extrabold text-club-primary">
        404
      </p>
      <h1 className="mt-4 font-(family-name:--font-heading) text-2xl font-bold text-club-dark md:text-3xl">
        Pagina no encontrada
      </h1>
      <p className="mt-3 max-w-md text-lg text-gray-600">
        Lo sentimos, la pagina que buscas no existe o ha sido movida. Puedes
        volver al inicio o intentar una busqueda.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          render={<Link href="/" />}
          variant="default"
          size="lg"
          className="rounded-full bg-club-primary px-6 text-white hover:bg-club-primary-light"
        >
          Volver al inicio
        </Button>
        <Button
          render={<Link href="/busqueda" />}
          variant="outline"
          size="lg"
          className="rounded-full px-6"
        >
          Buscar en el sitio
        </Button>
      </div>
    </div>
  )
}
