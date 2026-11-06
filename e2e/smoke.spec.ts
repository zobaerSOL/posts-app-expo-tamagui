import { expect, test } from '@playwright/test'

test('/posts renders a list server-side and hydrates', async ({ page, request }) => {
  const raw = await request.get('/posts')
  expect(raw.status()).toBe(200)
  const html = await raw.text()
  expect(html).toContain('<title>Posts | ShopHub</title>')
  expect(html).toContain(
    'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
  )

  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/posts')
  await expect(page.getByRole('heading', { name: 'Posts', exact: true })).toBeVisible()
  expect(await page.getByRole('link', { name: /sunt aut facere/ }).count()).toBeGreaterThan(0)
  expect(errors).toEqual([])
})

test('/posts/1 detail has the title in raw HTML and works after client navigation', async ({
  page,
  request,
}) => {
  const raw = await request.get('/posts/1')
  expect(raw.status()).toBe(200)
  const html = await raw.text()
  expect(html).toContain(
    'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
  )
  expect(html).toMatch(/<meta name="description" content="quia et suscipit/)

  await page.goto('/posts')
  await page
    .getByRole('link', { name: /sunt aut facere/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/posts\/1$/)
  await expect(page.getByRole('heading', { name: /sunt aut facere repellat/ })).toBeVisible()
})

test('a missing post is a real 404', async ({ request }) => {
  const res = await request.get('/posts/9999')
  expect(res.status()).toBe(404)
})

test('unknown route is a 404 with the not-found page', async ({ request }) => {
  const res = await request.get('/nope')
  expect(res.status()).toBe(404)
  expect(await res.text()).toContain('Page not found')
})
