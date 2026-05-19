import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/format'

type ArticleCardProps = {
  slug: string
  title: string
  publishedAt: string
  category?: string
  featuredImage?: { url: string; alt: string }
  official?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  club: 'Club',
  equipo: 'Equipo',
  academia: 'Academia',
  femenino: 'Femenino',
  comunidad: 'Comunidad',
  tienda: 'Tienda',
}

export function ArticleCard({
  slug,
  title,
  publishedAt,
  category,
  featuredImage,
  official,
}: ArticleCardProps) {
  return (
    <Link href={`/noticias/${slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        {featuredImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            {official && (
              <Badge variant="default" className="bg-club-secondary text-club-dark">
                Oficial
              </Badge>
            )}
            {category && (
              <Badge variant="secondary">
                {CATEGORY_LABELS[category] || category}
              </Badge>
            )}
          </div>
          <h3 className="font-(family-name:--font-heading) text-sm font-bold leading-snug group-hover:text-club-primary">
            {title}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(publishedAt)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
