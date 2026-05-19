'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter, type NewsletterState } from '@/app/actions/newsletter'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react'

export function NewsletterCta() {
  const [state, action, isPending] = useActionState<NewsletterState, FormData>(
    subscribeToNewsletter,
    null,
  )

  return (
    <Card className="border-club-secondary bg-club-light">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-club-secondary/20 p-2">
            <Mail className="h-5 w-5 text-club-secondary" />
          </div>
          <div>
            <h3 className="font-(family-name:--font-heading) font-semibold">
              Suscribete al Newsletter
            </h3>
            <p className="text-sm text-muted-foreground">
              Recibe noticias, resultados y alertas de partidos
            </p>
          </div>
        </div>

        {state?.success ? (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-club-primary/10 p-3 text-sm text-club-primary">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        ) : (
          <>
            <form action={action} className="mt-4 flex gap-2">
              <Input
                type="email"
                name="email"
                placeholder="tu@email.com"
                required
                aria-label="Email para newsletter"
                disabled={isPending}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="bg-club-primary text-white hover:bg-club-primary-light"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Suscribir'
                )}
              </Button>
            </form>
            {state && !state.success && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{state.message}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
