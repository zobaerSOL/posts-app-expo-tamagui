import { expect, test } from '@playwright/test'

test('home renders the employee dashboard server-side', async ({ request }) => {
  const res = await request.get('/')
  expect(res.status()).toBe(200)
  const html = await res.text()
  expect(html).toContain('<title>Home | SOL HR Portal</title>')
  expect(html).toContain('Nusrat')
  expect(html).toContain('Leave balance')
})

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('sidebar keeps Posts and Products in their own group and navigates', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByText('Demo APIs')).toBeVisible()
    await nav.getByRole('link', { name: 'Posts' }).click()
    await expect(page).toHaveURL(/\/posts$/)
    await expect(page.getByRole('heading', { name: 'Posts', exact: true })).toBeVisible()
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Products' })
      .click()
    await expect(page).toHaveURL(/\/products$/)
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Dashboard' })
      .click()
    await expect(page.getByText('Leave balance')).toBeVisible()
  })

  test('check out asks for confirmation, then can be undone', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Check Out' }).click()
    await expect(page.getByRole('dialog')).toContainText('Check out at')
    await page.getByRole('button', { name: 'Check out now' }).click()
    await expect(page.getByText('Not checked in')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Check In' })).toHaveCount(0)
    await page.getByText('Undo check-out').click()
    await expect(page.getByRole('button', { name: 'Check Out' })).toBeVisible()
  })

  test('missed-punch request needs a reason, then shows up as pending', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Request Missed Punch').click()
    await page.getByRole('button', { name: 'Send request' }).click()
    await expect(page.getByText('at least 10 characters')).toBeVisible()
    await page.getByRole('dialog').locator('textarea').fill('Gate reader was down this morning')
    await page.getByRole('button', { name: 'Send request' }).click()
    await expect(page.getByText('Missed-punch request sent')).toBeVisible()
    await expect(page.getByText(/Missed punch · \d\d \w{3} \(check out\)/)).toBeVisible()
  })

  test('notifications panel lists items and marks them read', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Notifications, 3 unread/ }).click()
    await expect(page.getByRole('dialog')).toContainText('Leave request waiting')
    await page.getByRole('button', { name: 'Mark all as read' }).click()
    await expect(page.getByRole('button', { name: /Notifications, 0 unread/ })).toBeVisible()
  })
})

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('bottom tabs plus a More drawer that reaches the demo screens', async ({ page }) => {
    await page.goto('/')
    const tabs = page.getByRole('navigation', { name: 'Primary' })
    await expect(tabs).toBeVisible()
    // the permanent sidebar is display:none on phones; the drawer only exists once opened
    const demoGroup = page.getByText('Demo APIs').filter({ visible: true })
    await expect(demoGroup).toHaveCount(0)
    await page.getByRole('button', { name: 'More' }).click()
    await expect(demoGroup).toBeVisible()
    await page.getByRole('link', { name: 'Products' }).filter({ visible: true }).click()
    await expect(page).toHaveURL(/\/products$/)
    await expect(demoGroup).toHaveCount(0)
  })
})
