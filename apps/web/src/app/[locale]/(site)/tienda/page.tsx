import type { Metadata } from 'next'
import { client } from '@/lib/sanity/client'
import { SHOP_PRODUCTS_QUERY } from '@/lib/sanity/queries'
import { ProductCard } from '@/components/commerce/product-card'
import { FilterBar } from '@/components/shared/filter-bar'
import { Pagination } from '@/components/shared/pagination'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { JsonLd, organizationJsonLd } from '@/components/shared/json-ld'

export const metadata: Metadata = {
  title: 'Tienda Oficial',
  description:
    'Tienda oficial de Platzi FC. Camisetas, equipaciones, merchandising y mas.',
}

type ProductItem = {
  _id: string
  name: string
  slug: { current: string }
  category?: string
  images?: Array<{ asset?: { url: string } }>
  variants?: Array<{ name: string; price: number; currency: string }>
  checkoutUrl?: string
  tags?: string[]
}

const CATEGORY_OPTIONS = [
  { label: 'Camisetas', value: 'camisetas' },
  { label: 'Ropa', value: 'ropa' },
  { label: 'Accesorios', value: 'accesorios' },
  { label: 'Coleccionables', value: 'coleccionables' },
]

const ITEMS_PER_PAGE = 12

type SearchParams = Promise<{ category?: string; page?: string }>

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { category, page: pageParam } = await searchParams
  const currentPage = Math.max(1, Number(pageParam) || 1)

  const products = await client
    .fetch<ProductItem[]>(SHOP_PRODUCTS_QUERY, {}, { next: { tags: ['shopProduct'] } })
    .catch(() => [])

  const filtered = category
    ? products.filter((p) => p.category === category)
    : products

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  function getPrice(product: ProductItem): string | undefined {
    const variant = product.variants?.[0]
    if (!variant) return undefined
    return `${variant.price} ${variant.currency}`
  }

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Tienda' }]} />

      <SectionHeader
        title="Tienda Oficial"
        description="Equipaciones, merchandising y productos oficiales de Platzi FC"
      />

      <div className="mt-6">
        <FilterBar paramName="category" options={CATEGORY_OPTIONS} allLabel="Todos" />
      </div>

      {paginated.length > 0 ? (
        <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {paginated.map((product) => (
            <ProductCard
              key={product._id}
              slug={product.slug.current}
              name={product.name}
              category={product.category}
              image={
                product.images?.[0]?.asset?.url
                  ? { url: product.images[0].asset.url, alt: product.name }
                  : undefined
              }
              price={getPrice(product)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-card border border-dashed border-border p-12 text-center text-muted-foreground">
          {category
            ? `No hay productos en la categoria "${category}".`
            : 'Los productos se cargaran desde Sanity CMS.'}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseHref="/tienda"
        queryParams={category ? { category } : undefined}
      />
    </div>
    </>
  )
}
