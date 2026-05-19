import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Breadcrumbs } from './breadcrumbs'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Breadcrumbs', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders items', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Noticias', href: '/noticias' },
          { label: 'Articulo' },
        ]}
      />,
    )
    expect(screen.getByText('Noticias')).toBeDefined()
    expect(screen.getByText('Articulo')).toBeDefined()
  })

  it('marks last item as current page', () => {
    render(<Breadcrumbs items={[{ label: 'Test' }]} />)
    expect(screen.getByText('Test').getAttribute('aria-current')).toBe('page')
  })

  it('renders JSON-LD script', () => {
    const { container } = render(<Breadcrumbs items={[{ label: 'Test' }]} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeDefined()
  })
})
