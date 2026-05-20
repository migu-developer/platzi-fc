import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { SEARCH_QUERY } from '@/lib/sanity/queries'
import { ArticleCard } from '@/components/news/article-card'
import { VideoCard } from '@/components/media/video-card'
import { ProductCard } from '@/components/commerce/product-card'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { SectionHeader } from '@/components/shared/section-header'
import { SearchForm } from './search-form'
import { formatDateTime, formatMatchScore } from '@/lib/utils/format'
import { Search, Newspaper, Users, Trophy, Play, ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Buscar',
  description: 'Busca noticias, jugadores, partidos y mas en el sitio oficial de Platzi FC.',
}

type SearchResults = {
  articles: Array<{
    _id: string
    title: string
    slug: { current: string }
    publishedAt: string
    category?: string
    featuredImage?: { asset?: { url: string } }
    official?: boolean
  }>
  players: Array<{
    _id: string
    firstName: string
    lastName: string
    number?: number
    position: string
    nationality?: string
    slug: { current: string }
  }>
  matches: Array<{
    _id: string
    datetime: string
    status: string
    homeScore?: number
    awayScore?: number
    matchday?: number
    slug: { current: string }
    homeTeam: { name: string }
    awayTeam: { name: string }
    competition?: { name: string }
  }>
  videos: Array<{
    _id: string
    title: string
    slug: { current: string }
    thumbnail?: { asset?: { url: string } }
    date: string
  }>
  products: Array<{
    _id: string
    name: string
    slug: { current: string }
    category?: string
    images?: Array<{ asset?: { url: string } }>
  }>
}

const POSITION_LABELS: Record<string, string> = {
  goalkeeper: 'Portero',
  defender: 'Defensa',
  midfielder: 'Centrocampista',
  forward: 'Delantero',
}

type SearchParams = Promise<{ q?: string; tab?: string }>

export default async function BusquedaPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, tab } = await searchParams
  const query = q?.trim() || ''

  let results: SearchResults | null = null
  if (query.length >= 2) {
    results = await client.fetch<SearchResults>(SEARCH_QUERY, { q: `${query}*` }).catch(() => null)
  }

  const counts = results
    ? {
        articles: results.articles.length,
        players: results.players.length,
        matches: results.matches.length,
        videos: results.videos.length,
        products: results.products.length,
      }
    : { articles: 0, players: 0, matches: 0, videos: 0, products: 0 }

  const totalResults = Object.values(counts).reduce((a, b) => a + b, 0)

  // Determine default tab based on which has results
  const defaultTab =
    tab ||
    (counts.articles > 0
      ? 'articles'
      : counts.players > 0
        ? 'players'
        : counts.matches > 0
          ? 'matches'
          : counts.videos > 0
            ? 'videos'
            : counts.products > 0
              ? 'products'
              : 'articles')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Buscar' }]} />

      <SectionHeader title="Buscar" />

      <div className="mt-6">
        <SearchForm initialQuery={query} />
      </div>

      {query && results ? (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} para &quot;{query}&quot;
          </p>

          {totalResults > 0 ? (
            <Tabs defaultValue={defaultTab} className="mt-6">
              <TabsList className="flex-wrap">
                {counts.articles > 0 && (
                  <TabsTrigger value="articles" className="gap-1.5">
                    <Newspaper className="h-3.5 w-3.5" />
                    Noticias ({counts.articles})
                  </TabsTrigger>
                )}
                {counts.players > 0 && (
                  <TabsTrigger value="players" className="gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Jugadores ({counts.players})
                  </TabsTrigger>
                )}
                {counts.matches > 0 && (
                  <TabsTrigger value="matches" className="gap-1.5">
                    <Trophy className="h-3.5 w-3.5" />
                    Partidos ({counts.matches})
                  </TabsTrigger>
                )}
                {counts.videos > 0 && (
                  <TabsTrigger value="videos" className="gap-1.5">
                    <Play className="h-3.5 w-3.5" />
                    Videos ({counts.videos})
                  </TabsTrigger>
                )}
                {counts.products > 0 && (
                  <TabsTrigger value="products" className="gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Tienda ({counts.products})
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Articles */}
              {counts.articles > 0 && (
                <TabsContent value="articles" className="mt-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.articles.map((article) => (
                      <ArticleCard
                        key={article._id}
                        slug={article.slug.current}
                        title={article.title}
                        publishedAt={article.publishedAt}
                        category={article.category}
                        official={article.official}
                        featuredImage={
                          article.featuredImage?.asset?.url
                            ? { url: article.featuredImage.asset.url, alt: article.title }
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Players */}
              {counts.players > 0 && (
                <TabsContent value="players" className="mt-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {results.players.map((player) => (
                      <Link key={player._id} href={`/equipo/${player.slug.current}`}>
                        <Card className="transition-shadow hover:shadow-md">
                          <CardContent className="flex items-center gap-4 p-4">
                            <span className="font-(family-name:--font-heading) text-2xl font-bold text-club-primary/30">
                              #{player.number ?? '?'}
                            </span>
                            <div>
                              <p className="font-semibold">
                                {player.firstName} {player.lastName}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {POSITION_LABELS[player.position] || player.position}
                                </Badge>
                                {player.nationality && (
                                  <span className="text-xs text-muted-foreground">
                                    {player.nationality}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Matches */}
              {counts.matches > 0 && (
                <TabsContent value="matches" className="mt-4">
                  <div className="space-y-2">
                    {results.matches.map((match) => (
                      <Link key={match._id} href={`/partidos/${match.slug.current}`}>
                        <Card className="transition-shadow hover:shadow-md">
                          <CardContent className="flex items-center justify-between gap-4 p-4">
                            <div>
                              <p className="font-semibold">
                                {match.homeTeam.name}{' '}
                                {formatMatchScore(match.homeScore, match.awayScore)}{' '}
                                {match.awayTeam.name}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {match.competition?.name}
                                {match.matchday != null && ` — Jornada ${match.matchday}`}
                              </p>
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {formatDateTime(match.datetime)}
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Videos */}
              {counts.videos > 0 && (
                <TabsContent value="videos" className="mt-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.videos.map((video) => (
                      <VideoCard
                        key={video._id}
                        slug={video.slug.current}
                        title={video.title}
                        date={video.date}
                        thumbnail={
                          video.thumbnail?.asset?.url
                            ? { url: video.thumbnail.asset.url, alt: video.title }
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </TabsContent>
              )}

              {/* Products */}
              {counts.products > 0 && (
                <TabsContent value="products" className="mt-4">
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                    {results.products.map((product) => (
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
                      />
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="mt-8 rounded-card border border-dashed border-border p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-muted-foreground">
                No se encontraron resultados para &quot;{query}&quot;.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Intenta con otros terminos de busqueda.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <Search className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <p className="mt-3 text-muted-foreground">
            Introduce un termino de busqueda (minimo 2 caracteres).
          </p>
        </div>
      )}
    </div>
  )
}
