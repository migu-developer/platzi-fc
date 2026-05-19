'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

type Season = {
  _id: string
  name: string
  slug: { current: string }
}

type Competition = {
  _id: string
  name: string
  slug: { current: string }
}

type SeasonCompetitionSelectorProps = {
  seasons: Season[]
  competitions: Competition[]
  currentSeason?: string
  currentCompetition?: string
}

export function SeasonCompetitionSelector({
  seasons,
  competitions,
  currentSeason,
  currentCompetition,
}: SeasonCompetitionSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeSeason = searchParams.get('season') ?? currentSeason ?? ''
  const activeCompetition = searchParams.get('competition') ?? currentCompetition ?? ''

  const handleChange = useCallback(
    (paramName: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(paramName, value)
      } else {
        params.delete(paramName)
      }
      params.delete('page')
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    },
    [pathname, router, searchParams],
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Season selector */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="season-select"
          className="font-(family-name:--font-heading) text-xs font-bold uppercase tracking-wide text-muted-foreground"
        >
          Temporada
        </label>
        <select
          id="season-select"
          value={activeSeason}
          onChange={(e) => handleChange('season', e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Todas</option>
          {seasons.map((season) => (
            <option key={season._id} value={season.slug.current}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      {/* Competition selector */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="competition-select"
          className="font-(family-name:--font-heading) text-xs font-bold uppercase tracking-wide text-muted-foreground"
        >
          Competicion
        </label>
        <select
          id="competition-select"
          value={activeCompetition}
          onChange={(e) => handleChange('competition', e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Todas</option>
          {competitions.map((comp) => (
            <option key={comp._id} value={comp.slug.current}>
              {comp.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
