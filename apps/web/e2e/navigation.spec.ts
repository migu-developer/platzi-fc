import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('home page loads and shows Platzi FC', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Platzi FC')
  })

  test('header contains main navigation links', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav[aria-label="Navegacion principal"]')
    await expect(nav.getByText('Partidos')).toBeVisible()
    await expect(nav.getByText('Equipo')).toBeVisible()
    await expect(nav.getByText('Noticias')).toBeVisible()
  })

  test('can navigate to partidos page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Partidos' }).first().click()
    await expect(page).toHaveURL('/partidos')
  })
})
