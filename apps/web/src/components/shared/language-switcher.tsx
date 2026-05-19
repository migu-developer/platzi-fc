'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5 text-xs">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={cn(
            'rounded px-1.5 py-0.5 font-medium transition-colors',
            locale === l
              ? 'bg-club-primary text-white'
              : 'text-muted-foreground hover:text-foreground',
          )}
          aria-label={`Cambiar a ${LOCALE_LABELS[l]}`}
          aria-current={locale === l ? 'true' : undefined}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  )
}
