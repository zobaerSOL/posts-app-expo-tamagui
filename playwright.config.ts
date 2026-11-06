import { defineConfig } from '@playwright/test'

const port = Number(process.env.E2E_PORT ?? 3100)

// Runs against the production server output (expo export + expo serve), not the dev server.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: 'list',
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: `npm run build:web && npx expo serve --port ${port}`,
    url: `http://localhost:${port}/posts`,
    reuseExistingServer: true,
    timeout: 300_000,
  },
})
