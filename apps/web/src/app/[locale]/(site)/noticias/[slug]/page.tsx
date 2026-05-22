import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity/client'
import { ARTICLE_BY_SLUG_QUERY } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { PortableText } from '@/components/shared/portable-text'
import { ArticleCard } from '@/components/news/article-card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { JsonLd, newsArticleJsonLd } from '@/components/shared/json-ld'
import { formatDate } from '@/lib/utils/format'

type Props = {
  params: Promise<{ slug: string }>
}

type ArticleData = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  author: string | null
  category: string
  tags: string[] | null
  excerpt: unknown[] | null
  body: unknown[]
  featuredImage: { asset: { _ref: string; url: string } } | null
  seo: { title?: string; description?: string; canonical?: string } | null
  official: boolean
  attachments: Array<{ asset: { url: string }; originalFilename: string }> | null
  relatedArticles: Array<{
    _id: string
    title: string
    slug: { current: string }
    publishedAt: string
    category: string
    featuredImage: { asset: { url: string } } | null
  }> | null
}

async function getArticle(slug: string): Promise<ArticleData | null> {
  return client
    .fetch<ArticleData>(ARTICLE_BY_SLUG_QUERY, { slug }, { next: { tags: ['article'] } })
    .catch(() => null)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: 'Noticia no encontrada' }
  }

  return {
    title: article.seo?.title || article.title,
    description: article.seo?.description || `Lee la noticia completa: ${article.title}`,
    openGraph: {
      title: article.title,
      description: article.seo?.description,
      type: 'article',
      publishedTime: article.publishedAt,
      ...(article.featuredImage?.asset?.url
        ? { images: [{ url: article.featuredImage.asset.url }] }
        : {}),
    },
  }
}

export default async function NoticiaDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com'

  return (
    <>
      <JsonLd
        data={newsArticleJsonLd({
          headline: article.title,
          datePublished: article.publishedAt,
          author: article.author || undefined,
          image: article.featuredImage?.asset?.url,
          url: `${siteUrl}/noticias/${article.slug.current}`,
          description: article.seo?.description,
        })}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Noticias', href: '/noticias' }, { label: article.title }]} />

        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              {article.official && (
                <Badge className="bg-club-secondary text-club-dark">Comunicado Oficial</Badge>
              )}
              {article.category && <Badge variant="secondary">{article.category}</Badge>}
            </div>
            <h1 className="mt-3 font-(family-name:--font-heading) text-3xl font-bold md:text-4xl">
              {article.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              {article.author && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>{article.author}</span>
                </>
              )}
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Featured image */}
          {article.featuredImage?.asset && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-card">
              <Image
                src={urlFor(article.featuredImage).width(960).height(540).url()}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          {/* Body */}
          <PortableText value={article.body} className="prose-platzi" />

          {/* Attachments (comunicados) */}
          {article.official && article.attachments && article.attachments.length > 0 && (
            <div className="mt-8 rounded-card border border-border p-4">
              <h3 className="font-(family-name:--font-heading) text-sm font-semibold uppercase tracking-wider">
                Archivos adjuntos
              </h3>
              <ul className="mt-3 space-y-2">
                {article.attachments.map((file, i) => (
                  <li key={i}>
                    <a
                      href={file.asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-club-primary underline underline-offset-2 hover:text-club-primary-light"
                    >
                      {file.originalFilename || `Archivo ${i + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* Related articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="mx-auto mt-16 max-w-5xl border-t pt-8">
            <SectionHeader title="Noticias relacionadas" viewAllHref="/noticias" />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {article.relatedArticles.map((related) => (
                <ArticleCard
                  key={related._id}
                  slug={related.slug.current}
                  title={related.title}
                  publishedAt={related.publishedAt}
                  category={related.category}
                  featuredImage={
                    related.featuredImage?.asset
                      ? { url: related.featuredImage.asset.url, alt: related.title }
                      : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
