import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type StaffCardProps = {
  slug: string
  name: string
  role: string
  photo?: { asset?: { url: string } }
}

export function StaffCard({ slug, name, role, photo }: StaffCardProps) {
  const photoUrl = photo?.asset?.url

  return (
    <Link href={`/equipo/${slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        {/* Photo */}
        <div className="relative aspect-[3/4] bg-muted">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-(family-name:--font-heading) text-4xl font-bold text-muted-foreground/30">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-3">
          <p className="font-(family-name:--font-heading) text-sm font-bold leading-tight">
            {name}
          </p>
          <div className="mt-1.5">
            <Badge variant="secondary" className="bg-club-light text-club-primary">
              {role}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
