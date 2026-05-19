import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Play } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

type VideoCardProps = {
  slug: string
  title: string
  date: string
  thumbnail?: { url: string; alt: string }
  duration?: string
}

export function VideoCard({ slug, title, date, thumbnail, duration }: VideoCardProps) {
  return (
    <Link href={`/media?video=${slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-video bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail.url}
              alt={thumbnail.alt || title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-club-dark">
              <Play className="h-10 w-10 text-white/40" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
            <div className="rounded-full bg-white/90 p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-5 w-5 text-club-primary" />
            </div>
          </div>
          {duration && (
            <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
              {duration}
            </span>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{formatDate(date)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
