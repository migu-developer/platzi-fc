'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Search, Menu, X, ChevronDown, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { CartButton } from '@/components/commerce/cart-button'

type NavChild = { label: string; href: string; desc?: string }
type NavItem = { label: string; href: string; children?: NavChild[] }

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Partidos',
    href: '/partidos',
    children: [
      { label: 'Calendario', href: '/partidos', desc: 'Proximos encuentros' },
      { label: 'Resultados', href: '/partidos?view=results', desc: 'Partidos finalizados' },
      { label: 'Competiciones', href: '/competicion/liga', desc: 'Tablas y clasificaciones' },
    ],
  },
  {
    label: 'Equipo',
    href: '/equipo',
    children: [
      { label: 'Primer Equipo', href: '/equipo', desc: 'Plantilla completa' },
      { label: 'Cuerpo Tecnico', href: '/equipo?view=staff', desc: 'Staff y directores' },
      { label: 'Cantera', href: '/academia', desc: 'Categorias inferiores' },
    ],
  },
  {
    label: 'Noticias',
    href: '/noticias',
    children: [
      { label: 'Ultimas Noticias', href: '/noticias', desc: 'Novedades del club' },
      { label: 'Comunicados', href: '/noticias?filter=official', desc: 'Comunicados oficiales' },
    ],
  },
  {
    label: 'Media',
    href: '/media',
    children: [
      { label: 'Videos', href: '/media', desc: 'Highlights y conferencias' },
      { label: 'Galerias', href: '/media?view=galleries', desc: 'Fotos de partidos y eventos' },
    ],
  },
  { label: 'Entradas', href: '/entradas' },
  { label: 'Tienda', href: '/tienda' },
  {
    label: 'Club',
    href: '/club',
    children: [
      { label: 'Historia', href: '/club/historia', desc: 'Trayectoria del club' },
      { label: 'Estadio', href: '/club/estadio', desc: 'Nuestro estadio' },
      { label: 'Fundacion', href: '/club/fundacion', desc: 'Impacto social' },
      { label: 'Contacto', href: '/club/contacto', desc: 'Escribenos' },
    ],
  },
]

function MegaMenuLink({
  href,
  label,
  desc,
}: {
  href: string
  label: string
  desc?: string
}) {
  return (
    <li>
      <NavigationMenuLink
        render={<Link href={href} />}
        className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
          <div className="text-sm font-medium leading-none">{label}</div>
          {desc && <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{desc}</p>}
      </NavigationMenuLink>
    </li>
  )
}

function DesktopNav() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {NAV_ITEMS.map((item) =>
          item.children ? (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuTrigger className="text-sm">
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[320px] gap-1 p-3">
                  {item.children.map((child) => (
                    <MegaMenuLink
                      key={child.href}
                      href={child.href}
                      label={child.label}
                      desc={child.desc}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink render={<Link href={item.href} />} className={navigationMenuTriggerStyle()}>
                  {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const toggle = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label))
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu" />
        }
      >
          <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-(family-name:--font-heading) text-lg text-club-primary">
            Platzi FC
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-3" />
        <nav aria-label="Menu principal">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggle(item.label)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          expanded === item.label && 'rotate-180',
                        )}
                      />
                    </button>
                    {expanded === item.label && (
                      <ul className="ml-3 mt-1 space-y-1 border-l-2 border-club-accent pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <Separator className="my-3" />
        <div className="space-y-2 px-3">
          <Link
            href="/fans"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-club-primary hover:underline"
          >
            Hazte Socio
          </Link>
          <Link
            href="/sponsors"
            onClick={() => setOpen(false)}
            className="block text-sm text-muted-foreground hover:underline"
          >
            Sponsors
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <MobileNav />

        {/* Logo */}
        <Link
          href="/"
          className="font-(family-name:--font-heading) text-xl font-bold text-club-primary"
        >
          Platzi FC
        </Link>

        {/* Desktop mega-menu */}
        <DesktopNav />

        {/* Utilities */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" render={<Link href="/login" aria-label="Mi cuenta" />}>
              <User className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" render={<Link href="/busqueda" aria-label="Buscar" />}>
              <Search className="h-4 w-4" />
          </Button>
          <CartButton />
          <Button
            render={<Link href="/entradas" />}
            size="sm"
            className="hidden bg-club-primary text-white hover:bg-club-primary-light sm:inline-flex"
          >
            Entradas
          </Button>
        </div>
      </div>
    </header>
  )
}
