import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PortableText } from '@/components/shared/portable-text'
import { groq } from 'next-sanity'

type Props = { params: Promise<{ slug: string }> }

type ProductData = {
  _id: string
  name: string
  slug: { current: string }
  category?: string
  description?: unknown[]
  images?: Array<{ asset: { _ref: string; url: string } }>
  variants?: Array<{
    name: string
    sku?: string
    price: number
    currency: string
    available: boolean
  }>
  checkoutUrl?: string
  tags?: string[]
  relatedPlayer?: { firstName: string; lastName: string; slug: { current: string } }
}

const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "shopProduct" && slug.current == $slug][0] {
    _id, name, slug, category, description, images, variants, checkoutUrl, tags,
    "relatedPlayer": relatedPlayer-> { firstName, lastName, slug }
  }
`

async function getProduct(slug: string) {
  return client
    .fetch<ProductData | null>(PRODUCT_BY_SLUG_QUERY, { slug }, { next: { tags: ['shopProduct'] } })
    .catch(() => null)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: product.name,
    description: `Compra ${product.name} en la tienda oficial de Platzi FC.`,
    openGraph: {
      title: product.name,
      ...(product.images?.[0]?.asset?.url
        ? { images: [{ url: product.images[0].asset.url }] }
        : {}),
    },
  }
}

export default async function ProductoDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const mainImage = product.images?.[0]
  const lowestPrice = product.variants
    ?.filter((v) => v.available)
    .sort((a, b) => a.price - b.price)[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Tienda', href: '/tienda' }, { label: product.name }]} />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-card bg-muted">
            {mainImage?.asset ? (
              <Image
                src={urlFor(mainImage).width(600).height(600).url()}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  {img.asset && (
                    <Image
                      src={urlFor(img).width(150).height(150).url()}
                      alt={`${product.name} ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2">
            {product.category && <Badge variant="secondary">{product.category}</Badge>}
            {product.relatedPlayer && (
              <Badge variant="outline">
                {product.relatedPlayer.firstName} {product.relatedPlayer.lastName}
              </Badge>
            )}
          </div>

          <h1 className="mt-3 font-(family-name:--font-heading) text-2xl font-bold sm:text-3xl">
            {product.name}
          </h1>

          {lowestPrice && (
            <p className="mt-2 font-(family-name:--font-heading) text-2xl font-bold text-club-primary">
              {lowestPrice.price} {lowestPrice.currency}
            </p>
          )}

          {product.description && <PortableText value={product.description} className="mt-4" />}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold">Variantes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <Card key={i} className={`${v.available ? '' : 'opacity-50'}`}>
                    <CardContent className="px-3 py-2 text-center">
                      <p className="text-xs font-medium">{v.name}</p>
                      <p className="text-sm font-bold">
                        {v.price} {v.currency}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {product.checkoutUrl && (
            <Button
              render={<a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer" />}
              size="lg"
              className="mt-6 w-full bg-club-primary text-white hover:bg-club-primary-light"
            >
              Comprar
            </Button>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
