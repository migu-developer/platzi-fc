export function formatDate(date: string, locale = 'es-ES'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: string, locale = 'es-ES'): string {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatMatchScore(home?: number, away?: number): string {
  if (home == null || away == null) return 'vs'
  return `${home} - ${away}`
}
