// Platzi FC — Shared type definitions
// Mirrors the data models from platzi-fc-requerimiento.md

// ─── Common ───────────────────────────────────────────────

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  children: Array<{ _type: string; _key: string; text: string }>
  [key: string]: unknown
}

export type SeoFields = {
  title?: string
  description?: string
  canonical?: string
}

export type SocialLink = {
  platform: string
  url: string
}

export type ImageAsset = {
  url: string
  alt: string
  width?: number
  height?: number
}

// ─── Season ───────────────────────────────────────────────

export type SeasonStatus = 'active' | 'archived'

export type Season = {
  _id: string
  name: string
  startDate: string
  endDate: string
  status: SeasonStatus
  slug: string
}

// ─── Competition ──────────────────────────────────────────

export type CompetitionType = 'league' | 'cup' | 'friendly'

export type Competition = {
  _id: string
  name: string
  type: CompetitionType
  country?: string
  region?: string
  logo?: ImageAsset
  slug: string
}

// ─── Team ─────────────────────────────────────────────────

export type TeamType = 'main' | 'rival' | 'academy'

export type Team = {
  _id: string
  name: string
  type: TeamType
  badge?: ImageAsset
  country: string
  city: string
  slug: string
}

// ─── Match ────────────────────────────────────────────────

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'suspended'

export type MatchEvent = {
  minute: number
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution' | 'var'
  playerId?: string
  playerInId?: string
  description?: string
}

export type LineupEntry = {
  playerId: string
  position: string
  number: number
  starter: boolean
}

export type Match = {
  _id: string
  seasonId: string
  competitionId: string
  matchday?: number
  datetime: string
  venueId: string
  homeTeamId: string
  awayTeamId: string
  status: MatchStatus
  homeScore?: number
  awayScore?: number
  attendance?: number
  referee?: string
  broadcastingRefs?: string[]
  homeLineup?: LineupEntry[]
  awayLineup?: LineupEntry[]
  events?: MatchEvent[]
  stats?: Record<string, { home: number; away: number }>
  slug: string
}

// ─── Player ───────────────────────────────────────────────

export type PlayerPosition = 'goalkeeper' | 'defender' | 'midfielder' | 'forward'
export type PlayerStatus = 'active' | 'injured' | 'loaned'
export type FootPreference = 'left' | 'right' | 'both'

export type ClubHistory = {
  clubName: string
  from: string
  to: string
}

export type SeasonStats = {
  seasonId: string
  competitionId?: string
  appearances: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
}

export type Player = {
  _id: string
  firstName: string
  lastName: string
  number?: number
  position: PlayerPosition
  dateOfBirth: string
  nationality: string
  height?: number
  weight?: number
  foot?: FootPreference
  photo?: ImageAsset
  bio?: PortableTextBlock[]
  status: PlayerStatus
  teamId: string
  clubHistory?: ClubHistory[]
  statsBySeason?: SeasonStats[]
  socialLinks?: SocialLink[]
  slug: string
}

// ─── Staff ────────────────────────────────────────────────

export type Staff = {
  _id: string
  name: string
  role: string
  photo?: ImageAsset
  bio?: PortableTextBlock[]
  teamId: string
  slug: string
}

// ─── Standings ────────────────────────────────────────────

export type StandingRow = {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form?: Array<'W' | 'D' | 'L'>
}

export type Standings = {
  _id: string
  seasonId: string
  competitionId: string
  rows: StandingRow[]
}

// ─── Article ──────────────────────────────────────────────

export type ArticleStatus = 'draft' | 'published'

export type Article = {
  _id: string
  title: string
  slug: string
  publishedAt: string
  authorRef?: string
  category: string
  tags?: string[]
  excerpt?: PortableTextBlock[]
  body: PortableTextBlock[]
  featuredMedia?: ImageAsset
  relatedArticles?: string[]
  seo?: SeoFields
  status: ArticleStatus
}

// ─── Official Communication ───────────────────────────────

export type OfficialCommunication = Article & {
  official: true
  attachments?: Array<{ name: string; url: string; type: string }>
}

// ─── Media ────────────────────────────────────────────────

export type MediaType = 'image' | 'video' | 'audio'

export type MediaAsset = {
  _id: string
  type: MediaType
  url: string
  alt?: string
  credits?: string
  duration?: number
  dimensions?: { width: number; height: number }
  tags?: string[]
  date: string
}

export type Video = {
  _id: string
  title: string
  slug: string
  platform?: string
  embedRef?: string
  categories?: string[]
  date: string
  relatedMatchId?: string
}

export type Gallery = {
  _id: string
  title: string
  slug: string
  items: MediaAsset[]
  relatedMatchId?: string
}

// ─── Venue ────────────────────────────────────────────────

export type Venue = {
  _id: string
  name: string
  address: string
  city: string
  country: string
  capacity: number
  mapEmbedRef?: string
  accessibility?: PortableTextBlock[]
  slug: string
}

// ─── Ticket ───────────────────────────────────────────────

export type TicketType = 'match' | 'season_pass' | 'membership'

export type TicketProduct = {
  _id: string
  type: TicketType
  matchId?: string
  seasonId?: string
  name: string
  description?: PortableTextBlock[]
  checkoutUrl: string
  zones?: string[]
  policies?: PortableTextBlock[]
}

// ─── Shop ─────────────────────────────────────────────────

export type ProductVariant = {
  name: string
  sku: string
  price: number
  currency: string
  available: boolean
}

export type ShopProduct = {
  _id: string
  name: string
  slug: string
  category: string
  description?: PortableTextBlock[]
  images?: ImageAsset[]
  variants?: ProductVariant[]
  checkoutUrl: string
  tags?: string[]
  relatedPlayerId?: string
}

// ─── Sponsor ──────────────────────────────────────────────

export type SponsorTier = 'main' | 'official' | 'partner' | 'supplier'

export type Sponsor = {
  _id: string
  name: string
  tier: SponsorTier
  logo: ImageAsset
  url: string
  activeFrom: string
  activeTo: string
  activations?: PortableTextBlock[]
  slug: string
}

// ─── Membership ───────────────────────────────────────────

export type MembershipPlan = {
  _id: string
  name: string
  level: string
  benefits?: PortableTextBlock[]
  priceRef?: string
  checkoutUrl: string
  slug: string
}

// ─── Fan Event ────────────────────────────────────────────

export type FanEvent = {
  _id: string
  name: string
  datetime: string
  location: string
  type: string
  description?: PortableTextBlock[]
  registrationUrl?: string
  capacity?: number
}

// ─── Config / Taxonomies ──────────────────────────────────

export type Taxonomy = {
  newsCategories: string[]
  tags: string[]
  countries: string[]
  positions: PlayerPosition[]
  staffRoles: string[]
  mediaTypes: MediaType[]
  eventTypes: string[]
}
