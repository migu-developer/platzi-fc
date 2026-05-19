import { describe, it, expect } from 'vitest'
import { formatMatchScore, formatDate, formatDateTime } from './format'

describe('formatMatchScore', () => {
  it('returns score when both values exist', () => {
    expect(formatMatchScore(2, 1)).toBe('2 - 1')
  })

  it('returns "vs" when scores are missing', () => {
    expect(formatMatchScore(undefined, undefined)).toBe('vs')
    expect(formatMatchScore(1, undefined)).toBe('vs')
    expect(formatMatchScore(undefined, 0)).toBe('vs')
  })

  it('handles zero scores', () => {
    expect(formatMatchScore(0, 0)).toBe('0 - 0')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2026-05-16T20:00:00Z', 'es-ES')
    expect(result).toContain('2026')
  })

  it('uses default locale', () => {
    const result = formatDate('2026-01-01')
    expect(result).toBeTruthy()
  })
})

describe('formatDateTime', () => {
  it('formats a datetime string', () => {
    const result = formatDateTime('2026-05-16T20:00:00Z', 'es-ES')
    expect(result).toContain('2026')
  })
})
