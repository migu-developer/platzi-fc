import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity/client'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { formatDate } from '@/lib/utils/format'

type GalleryItem = {
  asset: { url: string }
}

type Gallery = {
  _id: string
  title: string
  slug: { current: string }
  items: GalleryItem[]
  date: string
}

const GALLERY_BY_SLUG_QUERY = groq`
  *[_type == "gallery" && slug.current == $slug][0] {
    _id, title, slug, items[] { asset-> { url } }, date
  }
`

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const gallery = await client
    .fetch<Gallery | null>(GALLERY_BY_SLUG_QUERY, { slug })
    .catch(() => null)

  return {
    title: gallery ? gallery.title : `Galeria — ${slug}`,
    description: gallery
      ? `Galeria de fotos: ${gallery.title} — Platzi FC.`
      : `Galeria de fotos: ${slug} — Platzi FC.`,
  }
}

export default async function GaleriaDetailPage({ params }: Props) {
  const { slug } = await params

  const gallery = await client
    .fetch<Gallery | null>(
      GALLERY_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ['gallery'] } },
    )
    .catch(() => null)

  if (!gallery) {
    notFound()
  }

  const items = gallery.items ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Media', href: '/media' },
          { label: gallery.title },
        ]}
      />

      <SectionHeader title={gallery.title} />

      {gallery.date && (
        <p className="mt-2 text-sm text-muted-foreground">
          {formatDate(gallery.date)}
        </p>
      )}

      {items.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-card"
            >
              {item.asset?.url ? (
                <Image
                  src={item.asset.url}
                  alt={`${gallery.title} — foto ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                  Foto {i + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-card border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Esta galeria no tiene fotos por el momento.
          </p>
        </div>
      )}
    </div>
  )
}
