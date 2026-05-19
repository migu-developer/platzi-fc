import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity/client'
import { VIDEOS_QUERY } from '@/lib/sanity/queries'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { FilterBar } from '@/components/shared/filter-bar'
import { Pagination } from '@/components/shared/pagination'
import { VideoCard } from '@/components/media/video-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { ImageIcon, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

export const metadata: Metadata = {
  title: 'Media',
  description:
    'Videos, galerias de fotos y contenido multimedia oficial de Platzi FC.',
}

type Video = {
  _id: string
  title: string
  slug: { current: string }
  platform: string
  embedRef: string
  thumbnail: { asset?: { url: string } }
  categories: string[]
  date: string
}

type Gallery = {
  _id: string
  title: string
  slug: { current: string }
  itemCount: number
  thumbnail: string | null
  date: string
}

const GALLERIES_QUERY = groq`
  *[_type == "gallery"] | order(date desc) {
    _id, title, slug, "itemCount": count(items), "thumbnail": items[0].asset->url, date
  }
`

const VIDEO_CATEGORIES = [
  { label: 'Highlights', value: 'highlights' },
  { label: 'Conferencias', value: 'conferencias' },
  { label: 'Entrenamientos', value: 'entrenamientos' },
  { label: 'Entrevistas', value: 'entrevistas' },
  { label: 'Institucional', value: 'institucional' },
]

const ITEMS_PER_PAGE = 6

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1)

  const [allVideos, galleries] = await Promise.all([
    client
      .fetch<Video[]>(VIDEOS_QUERY, {}, { next: { tags: ['video'] } })
      .catch(() => []),
    client
      .fetch<Gallery[]>(GALLERIES_QUERY, {}, { next: { tags: ['gallery'] } })
      .catch(() => []),
  ])

  // Filter videos by category if provided
  const filteredVideos = category
    ? allVideos.filter((v) => v.categories?.includes(category))
    : allVideos

  // Pagination for videos
  const totalVideoPages = Math.max(1, Math.ceil(filteredVideos.length / ITEMS_PER_PAGE))
  const videoPage = Math.min(currentPage, totalVideoPages)
  const paginatedVideos = filteredVideos.slice(
    (videoPage - 1) * ITEMS_PER_PAGE,
    videoPage * ITEMS_PER_PAGE,
  )

  // Pagination for galleries
  const totalGalleryPages = Math.max(1, Math.ceil(galleries.length / ITEMS_PER_PAGE))
  const galleryPage = Math.min(currentPage, totalGalleryPages)
  const paginatedGalleries = galleries.slice(
    (galleryPage - 1) * ITEMS_PER_PAGE,
    galleryPage * ITEMS_PER_PAGE,
  )

  // Build query params to preserve across pagination links
  const videoQueryParams: Record<string, string> = {}
  if (category) videoQueryParams.category = category

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Media' }]} />

      <SectionHeader
        title="Media"
        description="Videos, galerias y contenido multimedia"
      />

      <div className="mt-8">
        <Tabs defaultValue="videos">
          <TabsList>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="galerias">Galerias</TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <div className="mt-4">
              <FilterBar paramName="category" options={VIDEO_CATEGORIES} />
            </div>

            {paginatedVideos.length > 0 ? (
              <>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedVideos.map((video) => (
                    <VideoCard
                      key={video._id}
                      slug={video.slug.current}
                      title={video.title}
                      date={video.date}
                      thumbnail={
                        video.thumbnail?.asset
                          ? { url: video.thumbnail.asset.url, alt: video.title }
                          : undefined
                      }
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={videoPage}
                  totalPages={totalVideoPages}
                  baseHref="/media"
                  queryParams={videoQueryParams}
                />
              </>
            ) : (
              <div className="mt-6 rounded-card border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">
                  No hay videos disponibles por el momento.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  El contenido se cargara desde Sanity CMS una vez configurado el proyecto.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="galerias">
            {paginatedGalleries.length > 0 ? (
              <>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedGalleries.map((gallery) => (
                    <Link
                      key={gallery._id}
                      href={`/media/galerias/${gallery.slug.current}`}
                    >
                      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                        <div className="relative aspect-video bg-muted">
                          {gallery.thumbnail ? (
                            <Image
                              src={gallery.thumbnail}
                              alt={gallery.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                            {gallery.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            {gallery.date && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(gallery.date)}
                              </span>
                            )}
                            <span>{gallery.itemCount} fotos</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                <Pagination
                  currentPage={galleryPage}
                  totalPages={totalGalleryPages}
                  baseHref="/media"
                />
              </>
            ) : (
              <div className="mt-6 rounded-card border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">
                  No hay galerias disponibles por el momento.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  El contenido se cargara desde Sanity CMS una vez configurado el proyecto.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
