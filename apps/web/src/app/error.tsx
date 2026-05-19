'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-(family-name:--font-heading) text-9xl font-extrabold text-club-primary">
        Error
      </p>
      <h1 className="mt-4 font-(family-name:--font-heading) text-2xl font-bold text-club-dark md:text-3xl">
        Algo salio mal
      </h1>
      <p className="mt-3 max-w-md text-lg text-gray-600">
        Ha ocurrido un error inesperado. Por favor, intenta de nuevo o vuelve al
        inicio.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={reset}
          variant="default"
          size="lg"
          className="rounded-full bg-club-primary px-6 text-white hover:bg-club-primary-light"
        >
          Intentar de nuevo
        </Button>
        <Button
          render={<Link href="/" />}
          variant="outline"
          size="lg"
          className="rounded-full px-6"
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}
