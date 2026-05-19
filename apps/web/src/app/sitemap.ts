import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com'

type SanitySlug = { slug: { current: string }; _updatedAt?: string }

async function fetchSlugs(type: string, filter = ''): Promise<SanitySlug[]> {
  return client
    .fetch<SanitySlug[]>(
      groq`*[_type == "${type}" ${filter}] { slug, _updatedAt }`,
    )
    .catch(() => [])
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/partidos`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/equipo`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/noticias`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/media`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/entradas`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/tienda`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/busqueda`, changeFrequency: 'weekly', priority: 0.3 },
    { url: `${SITE_URL}/fans`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/sponsors`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/academia`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/club`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/club/historia`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/club/estadio`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/club/fundacion`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/club/contacto`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/legal/terminos`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/legal/privacidad`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/legal/accesibilidad`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Dynamic pages from Sanity
  const [articles, players, matches, competitions, products, galleries] =
    await Promise.all([
      fetchSlugs('article', '&& status == "published"'),
      fetchSlugs('player'),
      fetchSlugs('match'),
      fetchSlugs('competition'),
      fetchSlugs('shopProduct'),
      fetchSlugs('gallery'),
    ])

  const dynamicPages: MetadataRoute.Sitemap = [
    ...articles.map((a) => ({
      url: `${SITE_URL}/noticias/${a.slug.current}`,
      lastModified: a._updatedAt ? new Date(a._updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...players.map((p) => ({
      url: `${SITE_URL}/equipo/${p.slug.current}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...matches.map((m) => ({
      url: `${SITE_URL}/partidos/${m.slug.current}`,
      lastModified: m._updatedAt ? new Date(m._updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...competitions.map((c) => ({
      url: `${SITE_URL}/competicion/${c.slug.current}`,
      lastModified: c._updatedAt ? new Date(c._updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/tienda/${p.slug.current}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...galleries.map((g) => ({
      url: `${SITE_URL}/media/galerias/${g.slug.current}`,
      lastModified: g._updatedAt ? new Date(g._updatedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  ]

  return [...staticPages, ...dynamicPages]
}
