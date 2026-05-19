import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { PAGE_BY_SECTION_QUERY } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { PortableText } from '@/components/shared/portable-text'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/shared/breadcrumbs'

type PageData = {
  _id: string
  title: string
  subtitle: string | null
  body: unknown[] | null
  featuredImage: { asset: { _ref: string } } | null
  seo: { title?: string; description?: string } | null
}

type CmsPageProps = {
  section: string
  breadcrumbs: BreadcrumbItem[]
  fallbackTitle: string
  fallbackDescription: string
}

export async function CmsPage({
  section,
  breadcrumbs,
  fallbackTitle,
  fallbackDescription,
}: CmsPageProps) {
  const page = await client
    .fetch<PageData>(
      PAGE_BY_SECTION_QUERY,
      { section },
      { next: { tags: ['page'] } },
    )
    .catch(() => null)

  const title = page?.title || fallbackTitle
  const subtitle = page?.subtitle || fallbackDescription

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-(family-name:--font-heading) text-3xl font-bold md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
        )}

        {page?.featuredImage?.asset && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-card">
            <Image
              src={urlFor(page.featuredImage).width(960).height(540).url()}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {page?.body ? (
          <PortableText value={page.body} className="mt-8" />
        ) : (
          <div className="mt-8 rounded-card border border-dashed border-border p-8 text-center">
            <p className="text-muted-foreground">
              El contenido de esta pagina se gestionara desde Sanity CMS.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Crea un documento de tipo &quot;Pagina&quot; con seccion &quot;{section}&quot; en el Studio.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export async function getCmsPageMetadata(section: string, fallbackTitle: string) {
  const page = await client
    .fetch<PageData>(
      PAGE_BY_SECTION_QUERY,
      { section },
      { next: { tags: ['page'] } },
    )
    .catch(() => null)

  return {
    title: page?.seo?.title || page?.title || fallbackTitle,
    description: page?.seo?.description || undefined,
  }
}
