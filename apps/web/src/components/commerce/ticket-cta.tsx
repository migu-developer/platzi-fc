import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Ticket } from 'lucide-react'

type TicketCtaProps = {
  matchLabel: string
  datetime: string
  checkoutUrl: string
}

export function TicketCta({ matchLabel, datetime, checkoutUrl }: TicketCtaProps) {
  return (
    <Card className="border-club-secondary bg-club-light">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-club-secondary/20 p-2">
            <Ticket className="h-5 w-5 text-club-secondary" />
          </div>
          <div>
            <p className="text-sm font-semibold">{matchLabel}</p>
            <p className="text-xs text-muted-foreground">{datetime}</p>
          </div>
        </div>
        <Button
          render={<a href={checkoutUrl} target="_blank" rel="noopener noreferrer" />}
          className="bg-club-primary text-white hover:bg-club-primary-light"
        >
          Comprar
        </Button>
      </CardContent>
    </Card>
  )
}
