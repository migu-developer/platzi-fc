import Link from 'next/link'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity/client'
import { Card, CardContent } from '@/components/ui/card'
import { SectionHeader } from '@/components/shared/section-header'
import { VideoCard } from '@/components/media/video-card'
import { ImageIcon } from 'lucide-react'

type MatchMediaProps = {
  matchId: string
}

type Video = {
  _id: string
  title: string
  slug: { current: string }
  thumbnail?: { url: string; alt: string }
  date: string
}

type Gallery = {
  _id: string
  title: string
  slug: { current: string }
  itemCount: number
  date: string
}

const videosQuery = groq`*[_type == "video" && relatedMatch._ref == $matchId] { _id, title, slug, thumbnail, date }`
const galleriesQuery = groq`*[_type == "gallery" && relatedMatch._ref == $matchId] { _id, title, slug, "itemCount": count(items), date }`

export async function MatchMedia({ matchId }: MatchMediaProps) {
  const [videos, galleries] = await Promise.all([
    client.fetch<Video[]>(videosQuery, { matchId }),
    client.fetch<Gallery[]>(galleriesQuery, { matchId }),
  ])

  const hasVideos = videos && videos.length > 0
  const hasGalleries = galleries && galleries.length > 0

  if (!hasVideos && !hasGalleries) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No hay contenido multimedia relacionado con este partido.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {/* Videos */}
      {hasVideos && (
        <section>
          <SectionHeader title="Videos" className="mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                slug={video.slug.current}
                title={video.title}
                date={video.date}
                thumbnail={video.thumbnail}
              />
            ))}
          </div>
        </section>
      )}

      {/* Galleries */}
      {hasGalleries && (
        <section>
          <SectionHeader title="Galerias" className="mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <Link
                key={gallery._id}
                href={`/media/galerias/${gallery.slug.current}`}
              >
                <Card className="group transition-shadow hover:shadow-md">
                  <div className="flex aspect-video items-center justify-center bg-muted">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                      {gallery.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {gallery.itemCount} {gallery.itemCount === 1 ? 'imagen' : 'imagenes'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
