import { Card, CardContent } from '@/components/ui/card'

export function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

export function MatchCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
        {/* Score area */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-8 w-14 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
        {/* Date */}
        <div className="mx-auto mt-3 h-3 w-28 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

export function PlayerCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[3/4] animate-pulse bg-muted" />
      <CardContent className="p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-1.5 h-5 w-16 animate-pulse rounded-full bg-muted" />
      </CardContent>
    </Card>
  )
}

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="mb-2 h-5 w-14 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

type GridSkeletonProps = {
  count: number
  type: 'card' | 'match' | 'player' | 'article'
}

const SKELETON_MAP = {
  card: CardSkeleton,
  match: MatchCardSkeleton,
  player: PlayerCardSkeleton,
  article: ArticleCardSkeleton,
} as const

export function GridSkeleton({ count, type }: GridSkeletonProps) {
  const Component = SKELETON_MAP[type]
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </div>
  )
}
