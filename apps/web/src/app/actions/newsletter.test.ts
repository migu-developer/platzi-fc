import { describe, it, expect } from 'vitest'
import { subscribeToNewsletter } from './newsletter'

function createFormData(email: string): FormData {
  const fd = new FormData()
  fd.set('email', email)
  return fd
}

describe('subscribeToNewsletter', () => {
  it('returns success for valid email', async () => {
    const result = await subscribeToNewsletter(null, createFormData('test@example.com'))
    expect(result?.success).toBe(true)
    expect(result?.message).toContain('suscrito')
  })

  it('returns error for empty email', async () => {
    const result = await subscribeToNewsletter(null, new FormData())
    expect(result?.success).toBe(false)
  })

  it('returns error for invalid email format', async () => {
    const result = await subscribeToNewsletter(null, createFormData('not-an-email'))
    expect(result?.success).toBe(false)
    expect(result?.message).toContain('formato')
  })
})
