import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Mail } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'

const FOOTER_SECTIONS = [
  {
    title: 'Club',
    links: [
      { label: 'Historia', href: '/club/historia' },
      { label: 'Estadio', href: '/club/estadio' },
      { label: 'Fundacion', href: '/club/fundacion' },
      { label: 'Contacto', href: '/club/contacto' },
      { label: 'Sponsors', href: '/sponsors' },
    ],
  },
  {
    title: 'Competicion',
    links: [
      { label: 'Partidos', href: '/partidos' },
      { label: 'Equipo', href: '/equipo' },
      { label: 'Noticias', href: '/noticias' },
      { label: 'Media', href: '/media' },
      { label: 'Academia', href: '/academia' },
    ],
  },
  {
    title: 'Servicios',
    links: [
      { label: 'Entradas', href: '/entradas' },
      { label: 'Tienda', href: '/tienda' },
      { label: 'Membresia', href: '/fans' },
      { label: 'Busqueda', href: '/busqueda' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terminos', href: '/legal/terminos' },
      { label: 'Privacidad', href: '/legal/privacidad' },
      { label: 'Accesibilidad', href: '/legal/accesibilidad' },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="border-t bg-club-dark text-gray-300">
      {/* Newsletter banner */}
      <div className="border-b border-white/10 bg-club-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-club-secondary/20 p-2">
              <Mail className="h-5 w-5 text-club-secondary" />
            </div>
            <div>
              <p className="font-(family-name:--font-heading) font-semibold text-white">
                Newsletter Platzi FC
              </p>
              <p className="text-sm text-club-accent">
                Recibe noticias, resultados y ofertas en tu correo
              </p>
            </div>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-(family-name:--font-heading) text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-club-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Platzi FC. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/legal/terminos" className="hover:text-gray-300">
              Terminos
            </Link>
            <Link href="/legal/privacidad" className="hover:text-gray-300">
              Privacidad
            </Link>
            <Link href="/legal/accesibilidad" className="hover:text-gray-300">
              Accesibilidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
