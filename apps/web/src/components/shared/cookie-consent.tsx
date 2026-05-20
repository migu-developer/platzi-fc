'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Cookie, Settings, X } from 'lucide-react'

type CookiePreferences = {
  necesarias: boolean
  analiticas: boolean
  marketing: boolean
}

const STORAGE_KEY = 'cookie-consent'
const PREFERENCES_KEY = 'cookie-preferences'

const DEFAULT_PREFERENCES: CookiePreferences = {
  necesarias: true,
  analiticas: false,
  marketing: false,
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (consent === null) {
      setVisible(true)
    }
  }, [])

  const accept = useCallback(() => {
    const allAccepted: CookiePreferences = {
      necesarias: true,
      analiticas: true,
      marketing: true,
    }
    localStorage.setItem(STORAGE_KEY, 'accepted')
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(allAccepted))
    setVisible(false)
  }, [])

  const reject = useCallback(() => {
    const onlyNecessary: CookiePreferences = {
      necesarias: true,
      analiticas: false,
      marketing: false,
    }
    localStorage.setItem(STORAGE_KEY, 'rejected')
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(onlyNecessary))
    setVisible(false)
  }, [])

  const savePreferences = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
    setVisible(false)
  }, [preferences])

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out"
      role="dialog"
      aria-label="Consentimiento de cookies"
    >
      {/* Backdrop */}
      <div className="bg-black/20 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 pb-4 pt-4 sm:px-6">
          <div className="rounded-t-xl rounded-b-xl bg-card p-6 ring-1 ring-foreground/10">
            {/* Main banner */}
            <div className="flex items-start gap-4">
              <div className="hidden shrink-0 rounded-lg bg-club-primary/10 p-2 sm:block">
                <Cookie className="h-5 w-5 text-club-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-(family-name:--font-heading) text-base font-bold">
                  Usamos cookies
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Utilizamos cookies para mejorar tu experiencia, analizar el trafico del sitio y
                  personalizar el contenido. Puedes aceptar todas, rechazarlas o configurar tus
                  preferencias.
                </p>
              </div>
            </div>

            {/* Settings panel */}
            {showSettings && (
              <div className="mt-4 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Configurar preferencias</h4>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowSettings(false)}
                    aria-label="Cerrar configuracion"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="mt-3 space-y-3">
                  {/* Necesarias - always on */}
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Necesarias</span>
                      <p className="text-xs text-muted-foreground">
                        Esenciales para el funcionamiento del sitio
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="h-4 w-4 accent-club-primary"
                    />
                  </label>

                  {/* Analiticas */}
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Analiticas</span>
                      <p className="text-xs text-muted-foreground">
                        Nos ayudan a entender como se usa el sitio
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analiticas}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          analiticas: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-club-primary"
                    />
                  </label>

                  {/* Marketing */}
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Marketing</span>
                      <p className="text-xs text-muted-foreground">
                        Permiten mostrar contenido personalizado
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          marketing: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-club-primary"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={savePreferences}
                    className="w-full bg-club-primary text-white hover:bg-club-primary-light"
                  >
                    Guardar preferencias
                  </Button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {!showSettings && (
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(true)}
                  className="order-3 sm:order-1"
                >
                  <Settings className="h-4 w-4" />
                  Configurar
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={reject}
                className={showSettings ? 'order-2' : 'order-2 sm:order-2'}
              >
                Rechazar
              </Button>
              <Button
                onClick={accept}
                className="order-1 bg-club-primary text-white hover:bg-club-primary-light sm:order-3"
              >
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
