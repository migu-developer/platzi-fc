import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth/config'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User, Heart, Bell, Globe, Bookmark, LogOut } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mi Perfil',
  description: 'Tu perfil de fan en Platzi FC',
}

export default async function PerfilPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  async function logoutAction() {
    'use server'
    await signOut({ redirectTo: '/' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Mi Perfil' }]} />

      {/* Profile header */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-club-primary">
          <User className="h-10 w-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-(family-name:--font-heading) text-2xl font-bold">
            {session.user?.name ?? 'Fan'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{session.user?.email}</p>
          <Badge className="mt-2 bg-club-secondary text-club-dark">Fan</Badge>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesion
          </Button>
        </form>
      </div>

      <Separator className="my-8" />

      {/* Mis preferencias */}
      <section>
        <h2 className="font-(family-name:--font-heading) text-xl font-bold">Mis preferencias</h2>
        <p className="mt-1 text-sm text-muted-foreground">Personaliza tu experiencia como fan</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-club-light p-2">
                  <Heart className="h-5 w-5 text-club-primary" />
                </div>
                <div>
                  <CardTitle className="font-(family-name:--font-heading) text-base font-bold">
                    Equipo favorito
                  </CardTitle>
                  <CardDescription>Selecciona tu equipo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Proximamente podras elegir tu equipo favorito y recibir contenido personalizado.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-club-light p-2">
                  <Bell className="h-5 w-5 text-club-primary" />
                </div>
                <div>
                  <CardTitle className="font-(family-name:--font-heading) text-base font-bold">
                    Notificaciones
                  </CardTitle>
                  <CardDescription>Gestiona tus alertas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configura las notificaciones de partidos, noticias y ofertas exclusivas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-club-light p-2">
                  <Globe className="h-5 w-5 text-club-primary" />
                </div>
                <div>
                  <CardTitle className="font-(family-name:--font-heading) text-base font-bold">
                    Idioma
                  </CardTitle>
                  <CardDescription>Cambia el idioma</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Elige tu idioma preferido para navegar el sitio del club.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Contenido guardado */}
      <section>
        <h2 className="font-(family-name:--font-heading) text-xl font-bold">Contenido guardado</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tus noticias, videos y articulos favoritos
        </p>

        <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Aun no has guardado contenido.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Explora noticias y media para guardar tus favoritos.
          </p>
        </div>
      </section>
    </div>
  )
}
