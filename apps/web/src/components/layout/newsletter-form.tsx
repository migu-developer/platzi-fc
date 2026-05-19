'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter, type NewsletterState } from '@/app/actions/newsletter'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function NewsletterForm() {
  const [state, action, isPending] = useActionState<NewsletterState, FormData>(
    subscribeToNewsletter,
    null,
  )

  if (state?.success) {
    return (
      <div className="flex items-center gap-2 text-sm text-club-accent">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{state.message}</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <form action={action} className="flex gap-2">
        <Input
          type="email"
          name="email"
          placeholder="tu@email.com"
          required
          className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
          aria-label="Email para newsletter"
          disabled={isPending}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-club-secondary text-club-dark hover:bg-club-secondary-light"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Suscribir'
          )}
        </Button>
      </form>
      {state && !state.success && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}
    </div>
  )
}
