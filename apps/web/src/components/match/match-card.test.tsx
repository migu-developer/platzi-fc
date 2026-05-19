import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MatchCard } from './match-card'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

describe('MatchCard', () => {
  afterEach(() => {
    cleanup()
  })

  const baseProps = {
    slug: 'test-match',
    datetime: '2026-05-16T20:00:00Z',
    status: 'finished' as const,
    homeTeam: { name: 'Platzi FC' },
    awayTeam: { name: 'Rival FC' },
    homeScore: 2,
    awayScore: 1,
    competition: 'Liga',
  }

  it('renders team names', () => {
    render(<MatchCard {...baseProps} />)
    expect(screen.getByText('Platzi FC')).toBeDefined()
    expect(screen.getByText('Rival FC')).toBeDefined()
  })

  it('shows score', () => {
    render(<MatchCard {...baseProps} />)
    expect(screen.getByText('2 - 1')).toBeDefined()
  })

  it('shows status badge', () => {
    render(<MatchCard {...baseProps} />)
    expect(screen.getByText('Finalizado')).toBeDefined()
  })

  it('links to match detail', () => {
    render(<MatchCard {...baseProps} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/partidos/test-match')
  })
})
