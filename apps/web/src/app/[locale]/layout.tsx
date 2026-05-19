import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter, Montserrat, Geist } from 'next/font/google'
import { cn } from '@/lib/utils'
import { routing } from '@/i18n/routing'
import '@/styles/globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontHeading = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | Platzi FC',
    default: 'Platzi FC — Sitio Oficial',
  },
  description: 'Sitio oficial de Platzi FC. Noticias, partidos, entradas, tienda y mas.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Platzi FC',
    title: 'Platzi FC — Sitio Oficial',
    description: 'Sitio oficial de Platzi FC. Noticias, partidos, entradas, tienda y mas.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Platzi FC — Sitio Oficial',
    description: 'Sitio oficial de Platzi FC. Noticias, partidos, entradas, tienda y mas.',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={cn(fontHeading.variable, fontBody.variable, 'font-sans', geist.variable)}>
      <body className="min-h-screen bg-white font-(family-name:--font-body) text-club-dark antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
