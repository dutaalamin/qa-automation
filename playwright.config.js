import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 *
 * Tests run against a live deployment by default so the suite exercises the
 * real, production build. Override with BASE_URL to point at a preview URL or
 * a local dev server.
 */
const BASE_URL = process.env.BASE_URL ?? 'https://fishytype.duta1.com';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // Mobile viewport runs on Chromium (the iPhone device profile defaults to
    // WebKit; we keep one engine so CI only needs a single browser download).
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
});
