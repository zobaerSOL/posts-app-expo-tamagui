import { expect, test } from '@playwright/test'

const routes: [path: string, heading: RegExp | string][] = [
  ['/', /, Nusrat$/],
  ['/posts', 'Posts'],
  ['/posts/1', /sunt aut facere repellat/],
  ['/products', 'All products'],
  ['/products/1', 'Essence Mascara Lash Princess'],
  ['/user/3', /User ID: 3/],
]

for (const [path, heading] of routes) {
  test(`${path} loads, hydrates, no console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await page.goto(path)
    await expect(page.getByText(heading).first()).toBeVisible()
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })
}

test('user route is a normal page on web (no modal)', async ({ page }) => {
  await page.goto('/posts/1')
  await page.getByRole('link', { name: 'user 1' }).click()
  await expect(page).toHaveURL(/\/user\/1$/)
  await expect(page.getByText('User ID: 1')).toBeVisible()
})

// Regression: the server renders 'light'; a dark-OS browser must hydrate without a mismatch.
test.describe('dark OS color scheme', () => {
  test.use({ colorScheme: 'dark' })
  for (const path of ['/', '/posts', '/posts/1']) {
    test(`${path} hydrates cleanly and ends up dark`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      await page.goto(path)
      await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
      await page.waitForLoadState('networkidle')
      expect(errors).toEqual([])
    })
  }
})
