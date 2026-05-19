import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { ARTICLES_QUERY } from '@/lib/sanity/queries'
import { ArticleCard } from '@/components/news/article-card'
import { FilterBar } from '@/components/shared/filter-bar'
import { Pagination } from '@/components/shared/pagination'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'

export const metadata: Metadata = {
  title: 'Noticias',
  description:
    'Ultimas noticias, comunicados y novedades de Platzi FC. Mantente informado sobre tu club.',
}

const CATEGORY_OPTIONS = [
  { label: 'Club', value: 'club' },
  { label: 'Equipo', value: 'equipo' },
  { label: 'Academia', value: 'academia' },
  { label: 'Femenino', value: 'femenino' },
  { label: 'Comunidad', value: 'comunidad' },
  { label: 'Tienda', value: 'tienda' },
]

const ITEMS_PER_PAGE = 9

type SearchParams = Promise<{ category?: string; page?: string }>

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category, page: pageParam } = await searchParams
  const currentPage = Math.max(1, Number(pageParam) || 1)

  // Fetch articles from Sanity
  const allArticles = await client.fetch<
    Array<{
      _id: string
      title: string
      slug: { current: string }
      publishedAt: string
      category: string
      featuredImage: { asset: { url: string } } | null
      official: boolean
    }>
  >(ARTICLES_QUERY, {}, { next: { tags: ['article'] } }).catch(() => [])

  // Filter by category
  const filtered = category
    ? allArticles.filter((a) => a.category === category)
    : allArticles

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Noticias' }]} />

      <SectionHeader
        title="Noticias"
        description="Las ultimas novedades y comunicados oficiales del club"
      />

      {/* Filtros */}
      <div className="mt-6">
        <FilterBar paramName="category" options={CATEGORY_OPTIONS} />
      </div>

      {/* Grid de noticias */}
      {paginated.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((article) => (
            <ArticleCard
              key={article._id}
              slug={article.slug.current}
              title={article.title}
              publishedAt={article.publishedAt}
              category={article.category}
              featuredImage={
                article.featuredImage?.asset
                  ? { url: article.featuredImage.asset.url, alt: article.title }
                  : undefined
              }
              official={article.official}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-card border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            {category
              ? `No hay noticias en la categoria "${category}" por el momento.`
              : 'No hay noticias publicadas por el momento.'}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            El contenido se cargara desde Sanity CMS una vez configurado el proyecto.
          </p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseHref="/noticias"
        queryParams={category ? { category } : undefined}
      />
    </div>
  )
}
