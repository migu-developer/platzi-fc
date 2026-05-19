import type { Metadata } from 'next'
import Link from 'next/link'
import { signIn } from '@/lib/auth/config'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Mail, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Iniciar sesion',
  description: 'Accede a tu cuenta de fan de Platzi FC',
}

export default function LoginPage() {
  async function loginAction(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    await signIn('credentials', { email, redirectTo: '/perfil' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Iniciar sesion' }]} />

      <div className="mx-auto max-w-md">
        {/* Club branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-club-primary">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-(family-name:--font-heading) mt-4 text-2xl font-bold text-club-primary">
            Iniciar sesion
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede a tu cuenta de fan de Platzi FC
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-(family-name:--font-heading) text-lg font-bold">
              Bienvenido de vuelta
            </CardTitle>
            <CardDescription>
              Ingresa tu email para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={loginAction} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="h-10"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-club-primary text-white hover:bg-club-primary-light"
                size="lg"
              >
                <Mail className="mr-2 h-4 w-4" />
                Continuar con email
              </Button>
            </form>

            <Separator className="my-6" />

            <p className="text-center text-xs text-muted-foreground">
              Al continuar, aceptas nuestros{' '}
              <Link href="/legal/terminos" className="underline hover:text-foreground">
                terminos
              </Link>{' '}
              y{' '}
              <Link href="/legal/privacidad" className="underline hover:text-foreground">
                privacidad
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
