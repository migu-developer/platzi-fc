type JsonLdProps = {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...data }) }}
    />
  )
}

// ─── Builders ─────────────────────────────────────────────

export function organizationJsonLd() {
  return {
    '@type': 'SportsOrganization',
    name: 'Platzi FC',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com',
    sport: 'Football',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com'}/logo.png`,
    },
    sameAs: [],
  }
}

export function sportsTeamJsonLd({
  name,
  url,
  coach,
  sport = 'Football',
}: {
  name: string
  url: string
  coach?: string
  sport?: string
}) {
  return {
    '@type': 'SportsTeam',
    name,
    url,
    sport,
    ...(coach ? { coach: { '@type': 'Person', name: coach } } : {}),
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'Platzi FC',
    },
  }
}

export function sportsEventJsonLd({
  name,
  startDate,
  location,
  homeTeam,
  awayTeam,
  url,
}: {
  name: string
  startDate: string
  location?: { name: string; address?: string }
  homeTeam: string
  awayTeam: string
  url: string
}) {
  return {
    '@type': 'SportsEvent',
    name,
    startDate,
    url,
    homeTeam: { '@type': 'SportsTeam', name: homeTeam },
    awayTeam: { '@type': 'SportsTeam', name: awayTeam },
    ...(location
      ? {
          location: {
            '@type': 'StadiumOrArena',
            name: location.name,
            ...(location.address ? { address: location.address } : {}),
          },
        }
      : {}),
  }
}

export function newsArticleJsonLd({
  headline,
  datePublished,
  dateModified,
  author,
  image,
  url,
  description,
}: {
  headline: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
  url: string
  description?: string
}) {
  return {
    '@type': 'NewsArticle',
    headline,
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    url,
    ...(description ? { description } : {}),
    ...(image ? { image: { '@type': 'ImageObject', url: image } } : {}),
    author: {
      '@type': author ? 'Person' : 'Organization',
      name: author || 'Platzi FC',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Platzi FC',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://platzifc.com'}/logo.png`,
      },
    },
  }
}

export function videoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
}: {
  name: string
  description?: string
  thumbnailUrl?: string
  uploadDate: string
  contentUrl?: string
  embedUrl?: string
  duration?: string
}) {
  return {
    '@type': 'VideoObject',
    name,
    ...(description ? { description } : {}),
    ...(thumbnailUrl ? { thumbnailUrl } : {}),
    uploadDate,
    ...(contentUrl ? { contentUrl } : {}),
    ...(embedUrl ? { embedUrl } : {}),
    ...(duration ? { duration } : {}),
  }
}

export function personJsonLd({
  name,
  url,
  image,
  jobTitle,
  nationality,
}: {
  name: string
  url: string
  image?: string
  jobTitle?: string
  nationality?: string
}) {
  return {
    '@type': 'Person',
    name,
    url,
    ...(image ? { image } : {}),
    ...(jobTitle ? { jobTitle } : {}),
    ...(nationality ? { nationality: { '@type': 'Country', name: nationality } } : {}),
    memberOf: { '@type': 'SportsTeam', name: 'Platzi FC' },
  }
}
