import { groq } from 'next-sanity'

// ─── Articles ─────────────────────────────────────────────

export const ARTICLES_QUERY = groq`
  *[_type == "article" && status == "published"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, category, excerpt, featuredImage, official
  }
`

export const ARTICLE_BY_SLUG_QUERY = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, author, category, tags, excerpt, body,
    featuredImage, seo, official, attachments,
    "relatedArticles": relatedArticles[]-> {
      _id, title, slug, publishedAt, category, featuredImage
    }
  }
`

// ─── Matches ──────────────────────────────────────────────

export const MATCHES_QUERY = groq`
  *[_type == "match"] | order(datetime desc) {
    _id, datetime, status, homeScore, awayScore, matchday, slug,
    "homeTeam": homeTeam-> { _id, name, badge, slug },
    "awayTeam": awayTeam-> { _id, name, badge, slug },
    "competition": competition-> { _id, name, slug },
    "season": season-> { _id, name }
  }
`

export const MATCH_BY_SLUG_QUERY = groq`
  *[_type == "match" && slug.current == $slug][0] {
    _id, datetime, status, homeScore, awayScore, matchday, attendance, referee,
    homeLineup[] { player-> { firstName, lastName }, position, number, starter },
    awayLineup[] { player-> { firstName, lastName }, position, number, starter },
    events[] { minute, type, player-> { firstName, lastName }, playerIn-> { firstName, lastName }, description },
    stats[] { label, home, away },
    slug,
    "homeTeam": homeTeam-> { _id, name, badge, slug },
    "awayTeam": awayTeam-> { _id, name, badge, slug },
    "competition": competition-> { _id, name, slug },
    "season": season-> { _id, name },
    "venue": venue-> { _id, name, city }
  }
`

// ─── Players ──────────────────────────────────────────────

export const PLAYERS_QUERY = groq`
  *[_type == "player" && status != "loaned"] | order(number asc) {
    _id, firstName, lastName, number, position, nationality, photo, status, slug
  }
`

export const PLAYER_BY_SLUG_QUERY = groq`
  *[_type == "player" && slug.current == $slug][0] {
    _id, firstName, lastName, number, position, dateOfBirth, nationality,
    height, weight, foot, photo, bio, status, clubHistory, statsBySeason,
    socialLinks, slug,
    "team": team-> { _id, name }
  }
`

// ─── Staff ───────────────────────────────────────────────

export const STAFF_QUERY = groq`
  *[_type == "staff"] | order(name asc) {
    _id, name, role, photo, slug
  }
`

// ─── Seasons ─────────────────────────────────────────────

export const SEASONS_QUERY = groq`
  *[_type == "season"] | order(startDate desc) {
    _id, name, slug, status
  }
`

// ─── Competitions List ───────────────────────────────────

export const COMPETITIONS_QUERY = groq`
  *[_type == "competition"] | order(name asc) {
    _id, name, type, slug
  }
`

// ─── Matches by Competition ──────────────────────────────

export const MATCHES_BY_COMPETITION_QUERY = groq`
  *[_type == "match" && competition->slug.current == $competitionSlug] | order(datetime desc) {
    _id, datetime, status, homeScore, awayScore, matchday, slug,
    "homeTeam": homeTeam-> { _id, name, badge, slug },
    "awayTeam": awayTeam-> { _id, name, badge, slug },
    "competition": competition-> { _id, name, slug },
    "season": season-> { _id, name }
  }
`

// ─── Standings ────────────────────────────────────────────

export const STANDINGS_QUERY = groq`
  *[_type == "standings" && season._ref == $seasonId && competition._ref == $competitionId][0] {
    _id,
    rows[] {
      played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points, form,
      "team": team-> { _id, name, badge, slug }
    }
  }
`

// ─── Competitions ─────────────────────────────────────────

export const COMPETITION_BY_SLUG_QUERY = groq`
  *[_type == "competition" && slug.current == $slug][0] {
    _id, name, type, country, logo, slug
  }
`

// ─── Videos ───────────────────────────────────────────────

export const VIDEOS_QUERY = groq`
  *[_type == "video"] | order(date desc) {
    _id, title, slug, platform, embedRef, thumbnail, categories, date
  }
`

// ─── Sponsors ─────────────────────────────────────────────

export const SPONSORS_QUERY = groq`
  *[_type == "sponsor"] | order(tier asc) {
    _id, name, tier, logo, url, slug
  }
`

// ─── Shop ─────────────────────────────────────────────────

export const SHOP_PRODUCTS_QUERY = groq`
  *[_type == "shopProduct"] | order(_createdAt desc) {
    _id, name, slug, category, images, variants, checkoutUrl, tags
  }
`

// ─── Tickets ──────────────────────────────────────────────

export const TICKET_PRODUCTS_QUERY = groq`
  *[_type == "ticketProduct"] {
    _id, name, type, checkoutUrl, zones,
    "match": match-> { _id, datetime, homeScore, awayScore, slug,
      "homeTeam": homeTeam-> { name, badge },
      "awayTeam": awayTeam-> { name, badge }
    }
  }
`

// ─── Search ──────────────────────────────────────────────

export const SEARCH_QUERY = groq`{
  "articles": *[_type == "article" && status == "published" && (title match $q || category match $q || pt::text(body) match $q)] | order(publishedAt desc) [0..9] {
    _id, title, slug, publishedAt, category, featuredImage, official
  },
  "players": *[_type == "player" && (firstName match $q || lastName match $q || nationality match $q || position match $q)] [0..9] {
    _id, firstName, lastName, number, position, nationality, photo, slug
  },
  "matches": *[_type == "match" && (homeTeam->name match $q || awayTeam->name match $q || competition->name match $q)] | order(datetime desc) [0..9] {
    _id, datetime, status, homeScore, awayScore, matchday, slug,
    "homeTeam": homeTeam-> { name },
    "awayTeam": awayTeam-> { name },
    "competition": competition-> { name }
  },
  "videos": *[_type == "video" && title match $q] | order(date desc) [0..5] {
    _id, title, slug, thumbnail, date
  },
  "products": *[_type == "shopProduct" && (name match $q || category match $q)] [0..5] {
    _id, name, slug, category, images
  }
}`

// ─── CMS Pages ───────────────────────────────────────────

export const PAGE_BY_SECTION_QUERY = groq`
  *[_type == "page" && section == $section][0] {
    _id, title, subtitle, slug, section, body, featuredImage, seo
  }
`
