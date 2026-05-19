// Object types
import { seo } from './objects/seo'
import { socialLink } from './objects/socialLink'
import { matchEvent } from './objects/matchEvent'
import { lineupEntry } from './objects/lineupEntry'
import { seasonStats } from './objects/seasonStats'
import { clubHistory } from './objects/clubHistory'
import { standingRow } from './objects/standingRow'
import { productVariant } from './objects/productVariant'
import { matchStat } from './objects/matchStat'
import { videoCategory } from './objects/videoCategory'

// Document types
import { season } from './documents/season'
import { competition } from './documents/competition'
import { team } from './documents/team'
import { match } from './documents/match'
import { player } from './documents/player'
import { staff } from './documents/staff'
import { standings } from './documents/standings'
import { article } from './documents/article'
import { video } from './documents/video'
import { gallery } from './documents/gallery'
import { venue } from './documents/venue'
import { ticketProduct } from './documents/ticketProduct'
import { shopProduct } from './documents/shopProduct'
import { sponsor } from './documents/sponsor'
import { membershipPlan } from './documents/membershipPlan'
import { fanEvent } from './documents/fanEvent'
import { page } from './documents/page'

export const schemaTypes = [
  // Objects
  seo,
  socialLink,
  matchEvent,
  lineupEntry,
  seasonStats,
  clubHistory,
  standingRow,
  productVariant,
  matchStat,
  videoCategory,

  // Documents
  season,
  competition,
  team,
  match,
  player,
  staff,
  standings,
  article,
  video,
  gallery,
  venue,
  ticketProduct,
  shopProduct,
  sponsor,
  membershipPlan,
  fanEvent,
  page,
]
