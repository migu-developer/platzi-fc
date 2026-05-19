'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatMatchScore } from '@/lib/utils/format'

type LiveMatch = {
  _id: string
  status: string
  homeScore: number
  awayScore: number
  slug: { current: string }
  homeTeam: { name: string }
  awayTeam: { name: string }
}

export function LiveMatchBanner() {
  const [matches, setMatches] = useState<LiveMatch[]>([])

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch('/api/match-live/list')
        if (!res.ok) return
        const data: LiveMatch[] = await res.json()
        setMatches(data)
      } catch {
        // Silently ignore fetch errors
      }
    }

    fetchLive()
    const interval = setInterval(fetchLive, 30000)
    return () => clearInterval(interval)
  }, [])

  if (matches.length === 0) return null

  return (
    <div className="bg-red-600 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Pulsing dot */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">En Vivo</span>
        </div>

        {/* Match list */}
        <div className="flex items-center gap-6">
          {matches.map((match) => (
            <Link
              key={match._id}
              href={`/partidos/${match.slug?.current ?? match._id}`}
              className="flex shrink-0 items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
            >
              <span>{match.homeTeam.name}</span>
              <span className="font-(family-name:--font-heading) font-bold">
                {formatMatchScore(match.homeScore, match.awayScore)}
              </span>
              <span>{match.awayTeam.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
